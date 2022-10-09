<script setup>
  const props = defineProps({
    player: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    signedOn: null,
    movedOn: null,
    origin: '',
    destination: '',
    fee: null,
    addonClause: 0
  })

  const rulesFor = {
    origin: [isRequired('Origin')],
    destination: [isRequired('Destination')],
    addonClause: [
      isNumber('Add-On Clause'),
      inRange('Add-On Clause', [0, 25])
    ]
  }

  const { team } = useTeam()
  const transferOut = computed(() =>
    props.record
      ? team.value.name === props.record.origin
      : props.player.status?.length > 0
  )
  const transferColor = computed(() => transferOut.value ? 'red' : 'green')

  function onOpen () {
    if (props.record) {
      Object.assign(attributes, pick(props.record, [
        'signedOn',
        'movedOn',
        'origin',
        'destination',
        'fee',
        'addonClause'
      ]))
    } else {
      attributes.movedOn = team.value.currentlyOn
      if (transferOut.value) {
        attributes.origin = team.value.name
      } else {
        attributes.destination = team.value.name
      }
    }
  }


  watchEffect(() => {
    if (!attributes.addonClause) {
      attributes.addonClause = 0
    }
  })

  const { executeMutation: createTransfer } = useMutation(gql`
    mutation createTransfer($playerId: ID!, $attributes: TransferAttributes!) {
      addTransfer(playerId: $playerId, attributes: $attributes) {
        transfer { ...TransferData }
        errors { fullMessages }
      }
    }
    ${transferFragment}
  `)

  const { executeMutation: updateTransfer } = useMutation(gql`
    mutation ($id: ID!, $attributes: TransferAttributes!) {
      updateTransfer(id: $id, attributes: $attributes) {
        transfer { ...TransferData }
        errors { fullMessages }
      }
    }
    ${transferFragment}
  `)

  async function onSubmit () {
    if (props.record) {
      const { data: { updateTransfer: { errors} } } =
        await updateTransfer({ id: props.record.id, attributes })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addTransfer: { errors } } } =
        await createTransfer({ playerId: props.playerId, attributes })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    }
  }
</script>

<template>
  <dialog-form
    :title="`Transfer ${player.name}`"
    :submit="onSubmit"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="12">
        <date-field
          v-model="attributes.signedOn"
          label="Signed Date"
          prepend-icon="mdi-calendar-edit"
          :prefill="team.currentlyOn"
          clearable
        />
      </v-col>
      <v-col cols="12">
        <date-field
          v-model="attributes.movedOn"
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          :min="attributes.signedOn"
          :prefill="team.currentlyOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.origin"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
          :rules="rulesFor.origin"
          :disabled="transferOut"
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="rulesFor.destination"
          :disabled="!transferOut"
        />
      </v-col>
      <v-col cols="12">
        <money-field
          v-model.number="attributes.fee"
          label="Fee"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.addonClause"
          label="Add-On Clause (%)"
          :rules="rulesFor.addonClause"
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

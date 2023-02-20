<script setup>
  const props = defineProps({
    player: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const { team } = useTeam()
  const attributes = reactive({})
  const durationOn = ref(false)
  function onOpen() {
    attributes.startedOn = props.record?.startedOn ?? team.value.currentlyOn
    attributes.endedOn = props.record?.endedOn ?? team.value.currentlyOn
    attributes.description = props.record?.description
    durationOn.value = !props.record
    if (durationOn.value) {
      attributes.duration = {
        length: null,
        timespan: null
      }
    }
  }

  const rulesFor = {
    description: [isRequired('Description')],
    durationLength: [
      isRequired('Length of Duration'),
      isNumber('Length of Duration')
    ],
    durationTimespan: [isRequired('Timespan')]
  }

  const timespans = ['Days', 'Weeks', 'Months', 'Years']

  const title = computed(() =>
    props.record ? 'Update Injury' : 'Record New Injury'
  )

  watchEffect(() => {
    if (durationOn.value) {
      attributes.duration = {
        length: null,
        timespan: null
      }
    } else {
      delete attributes.duration
    }
  })

  const { executeMutation: createInjury } = useMutation(gql`
    mutation createInjury($playerId: ID!, $attributes: InjuryAttributes!) {
      addInjury(playerId: $playerId, attributes: $attributes) {
        injury {
          ...InjuryData
        }
        errors {
          fullMessages
        }
      }
    }
    ${injuryFragment}
  `)

  const { executeMutation: updateInjury } = useMutation(gql`
    mutation ($id: ID!, $attributes: InjuryAttributes!) {
      updateInjury(id: $id, attributes: $attributes) {
        injury {
          ...InjuryData
        }
        errors {
          fullMessages
        }
      }
    }
    ${injuryFragment}
  `)

  async function onSubmit() {
    if (props.record) {
      const {
        data: {
          updateInjury: { errors }
        }
      } = await updateInjury({ id: props.record.id, attributes })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    } else {
      const {
        data: {
          addInjury: { errors }
        }
      } = await createInjury({ playerId: props.player.id, attributes })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    }
  }
</script>

<template>
  <dialog-form
    :title="title"
    :validate-on-open="!!record"
    :submit="onSubmit"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="12">
        <date-field
          v-model="attributes.startedOn"
          label="Injury Date"
          prepend-icon="mdi-calendar-today"
          required
        />
      </v-col>
      <template v-if="durationOn">
        <v-col cols="6">
          <v-text-field
            v-model.number="attributes.duration['length']"
            label="Length of Duration"
            prepend-icon="mdi-ruler"
            :rules="rulesFor.durationLength"
            inputmode="numeric"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="attributes.duration.timespan"
            :items="timespans"
            label="Timespan"
            append-outer-icon="mdi-calendar"
            :rules="rulesFor.durationTimespan"
            @click:append-outer="durationOn = false"
          />
        </v-col>
      </template>
      <v-col v-else cols="12">
        <date-field
          v-model="attributes.endedOn"
          label="Recovery Date"
          prepend-icon="mdi-calendar"
          :append-outer-icon="record ? null : 'mdi-ruler'"
          :min="attributes.startedOn"
          :prefill="team.currentlyOn"
          required
          @click:append-outer="durationOn = true"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.description"
          label="Description"
          prepend-icon="mdi-ambulance"
          :rules="rulesFor.description"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

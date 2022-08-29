<script setup>
  import { useTeam } from '~/composables'
  import { transferFragment } from '~/fragments'

  const { team } = useTeam()

  const props = defineProps({
    playerId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    signedOn: props.record?.signedOn,
    movedOn: props.record?.movedOn,
    origin: props.record?.origin,
    destination: props.record?.destination,
    fee: props.record?.fee,
    addonClause: props.record?.addonClause
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

  const emit = defineEmits(['created', 'click:remove'])
  async function onSubmit () {
    if (props.record) {
      const { data: { updateTransfer: { errors, transfer} } } =
        await updateTransfer({ id: props.record.id, attributes })
      if (transfer) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addTransfer: { errors, transfer } } } =
        await createTransfer({ playerId: props.playerId, attributes })
      if (transfer) {
        emit('created')
      } else {
        alert(errors.fullMessages[0])
      }
    }
  }
</script>

<template>
  <tr>
    <td>
      <v-text-field
        v-model="attributes.signedOn"
        type="date"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.movedOn"
        type="date"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.origin"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.destination"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.fee"
        type="number"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.addonClause"
        type="number"
        min="0"
        max="25"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn
          icon="mdi-content-save"
          variant="text"
          @click="onSubmit"
        />
        &nbsp;
        <v-btn
          v-if="!!props.record"
          icon="mdi-close"
          variant="text"
          @click="inEditMode = false"
        />
        <v-btn
          v-else
          icon="mdi-delete"
          variant="text"
          @click="emit('click:remove')"
        />
      </template>
      <template v-else>
        <v-btn
          icon="mdi-pencil"
          variant="text"
          @click="inEditMode = true"
        />
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Transfer"
          label="Transfer"
          icon="mdi-delete"
        />
      </template>
    </td>
  </tr>
</template>

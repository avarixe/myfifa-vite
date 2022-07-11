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

  const emit = defineEmits()
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
      <input
        v-if="inEditMode"
        v-model="attributes.signedOn"
        type="date"
      />
      <template v-else>{{ record.signedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.movedOn"
        type="date"
      />
      <template v-else>{{ record.movedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.origin"
      />
      <template v-else>{{ record.origin }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.destination"
      />
      <template v-else>{{ record.destination }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.fee"
        type="number"
      />
      <template v-else>{{ record.fee }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.addonClause"
        type="number"
        min="0"
        max="25"
      />
      <template v-else>{{ record.addonClause }}</template>
    </td>
    <td>
      <template v-if="inEditMode">
        <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
        <button v-if="!!props.record" href="#" @click="inEditMode = false">Cancel</button>
        <button v-else href="#" @click="$emit('click:remove')">Remove</button>
      </template>
      <template v-else>
        <a href="#" @click="inEditMode = true">Edit</a>
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Transfer"
          label="Transfer"
        />
      </template>
    </td>
  </tr>
</template>

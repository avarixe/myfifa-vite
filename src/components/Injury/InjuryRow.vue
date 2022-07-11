<script setup>
  import { useTeam } from '~/composables'
  import { injuryFragment } from '~/fragments'

  const { team } = useTeam()

  const props = defineProps({
    playerId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    startedOn: props.record?.startedOn,
    endedOn: props.record?.endedOn,
    description: props.record?.description
  })

  const { executeMutation: createInjury } = useMutation(gql`
    mutation createInjury($playerId: ID!, $attributes: InjuryAttributes!) {
      addInjury(playerId: $playerId, attributes: $attributes) {
        injury { ...InjuryData }
        errors { fullMessages }
      }
    }
    ${injuryFragment}
  `)

  const { executeMutation: updateInjury } = useMutation(gql`
    mutation ($id: ID!, $attributes: InjuryAttributes!) {
      updateInjury(id: $id, attributes: $attributes) {
        injury { ...InjuryData }
        errors { fullMessages }
      }
    }
    ${injuryFragment}
  `)

  const emit = defineEmits()
  async function onSubmit () {
    if (props.record) {
      const { data: { updateInjury: { errors, injury} } } =
        await updateInjury({ id: props.record.id, attributes })
      if (injury) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addInjury: { errors, injury } } } =
        await createInjury({ playerId: props.playerId, attributes })
      if (injury) {
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
        v-model="attributes.startedOn"
        type="date"
      />
      <template v-else>{{ record.startedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.endedOn"
        type="date"
      />
      <template v-else>{{ record.endedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.description"
      />
      <template v-else>{{ record.description }}</template>
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
          store="Injury"
          label="Injury"
        />
      </template>
    </td>
  </tr>
</template>

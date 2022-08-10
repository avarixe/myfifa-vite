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
      <v-text-field
        v-model="attributes.startedOn"
        type="date"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.endedOn"
        type="date"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.description"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</v-btn>
        &nbsp;
        <v-btn v-if="!!props.record" @click="inEditMode = false">Cancel</v-btn>
        <v-btn v-else @click="$emit('click:remove')">Remove</v-btn>
      </template>
      <template v-else>
        <v-btn @click="inEditMode = true">Edit</v-btn>
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

<script setup>
  import { useTeam } from '~/composables'
  import { goalFragment } from '~/fragments'

  const { team } = useTeam()

  const props = defineProps({
    match: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    minute: props.record?.minute,
    home: props.record?.home || false,
    playerId: props.record?.playerId,
    playerName: props.record?.playerName,
    assistedBy: props.record?.assistedBy,
    assistId: props.record?.assistId,
    ownGoal: props.record?.ownGoal || false,
    penalty: props.record?.penalty || false
  })

  const { executeMutation: createGoal } = useMutation(gql`
    mutation createGoal($matchId: ID!, $attributes: GoalAttributes!) {
      addGoal(matchId: $matchId, attributes: $attributes) {
        goal { ...GoalData }
        errors { fullMessages }
      }
    }
    ${goalFragment}
  `)

  const { executeMutation: updateGoal } = useMutation(gql`
    mutation ($id: ID!, $attributes: GoalAttributes!) {
      updateGoal(id: $id, attributes: $attributes) {
        goal { ...GoalData }
        errors { fullMessages }
      }
    }
    ${goalFragment}
  `)

  const emit = defineEmits()
  async function onSubmit () {
    if (props.record) {
      const { data: { updateGoal: { errors, goal} } } =
        await updateGoal({ id: props.record.id, attributes })
      if (goal) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addGoal: { errors, goal } } } =
        await createGoal({ matchId: props.match.id, attributes })
      if (goal) {
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
        v-model="attributes.minute"
        type="number"
        min="1"
        :max="match.extraTime ? 120 : 90"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.home"
        type="checkbox"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.playerName"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.assistedBy"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.penalty"
        type="checkbox"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.ownGoal"
        type="checkbox"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
        &nbsp;
        <button v-if="!!props.record" @click="inEditMode = false">Cancel</button>
        <button v-else @click="$emit('click:remove')">Remove</button>
      </template>
      <template v-else>
        <button @click="inEditMode = true">Edit</button>
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Goal"
          label="Goal"
        />
      </template>
    </td>
  </tr>
</template>

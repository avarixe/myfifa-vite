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

  const emit = defineEmits(['created', 'click:remove'])
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
    <td :style="{ minWidth: '8em' }">
      <v-text-field
        v-model="attributes.minute"
        type="number"
        min="1"
        :max="match.extraTime ? 120 : 90"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-checkbox
        v-model="attributes.home"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td :style="{ minWidth: '15em' }">
      <v-text-field
        v-model="attributes.playerName"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td :style="{ minWidth: '15em' }">
      <v-text-field
        v-model="attributes.assistedBy"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-checkbox
        v-model="attributes.penalty"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-checkbox
        v-model="attributes.ownGoal"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</v-btn>
        &nbsp;
        <v-btn v-if="!!props.record" @click="inEditMode = false">Cancel</v-btn>
        <v-btn v-else @click="emit('click:remove')">Remove</v-btn>
      </template>
      <template v-else>
        <v-btn @click="inEditMode = true">Edit</v-btn>
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

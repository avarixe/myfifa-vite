<script setup lang="ts">
  import { Cap, Match } from '~/models'

  const props = defineProps<{
    cap: Cap
    match: Match
  }>()

  const { team } = useTeam()

  const attributes: GoalAttributes = reactive({
    home: props.match.home === team.value.name,
    playerId: props.cap.playerId,
    playerName: props.cap.name,
    assistedBy: '',
    assistId: '',
    ownGoal: false,
    penalty: false
  })

  watchEffect(() => {
    attributes.home = props.match.home === team.value.name
    attributes.playerId = props.cap.playerId
    attributes.playerName = props.cap.name

    if (attributes.penalty || attributes.ownGoal) {
      attributes.assistId = null
      attributes.assistedBy = null
    }
  })

  const { minute, unsubbedPlayers } = useMatch(props.match)
  const assistOptions = computed(() =>
    unsubbedPlayers.value.filter(
      (cap: Cap) => cap.playerId !== attributes.playerId
    )
  )

  const emit = defineEmits(['submitted'])
  const { form, formKey, formIsLoading, formIsValid, submitForm } = useForm({
    mutation: gql`
      mutation ($matchId: ID!, $attributes: GoalAttributes!) {
        addGoal(matchId: $matchId, attributes: $attributes) {
          goal {
            ...GoalData
          }
        }
      }
      ${goalFragment}
    `,
    variables: () => ({
      matchId: props.match.id,
      attributes: { ...attributes, minute: minute.value }
    }),
    onSuccess() {
      emit('submitted')
    },
    onReset() {
      attributes.ownGoal = false
      attributes.penalty = false
    }
  })
</script>

<template>
  <v-form
    ref="form"
    :key="formKey"
    v-model="formIsValid"
    @submit.prevent="submitForm"
  >
    <div class="pa-2">
      <div class="text-subtitle-2 pb-2">Add Goal</div>
      <v-text-field v-model.number="minute" label="Minute" type="number" />
      <cap-select
        v-model="attributes.assistId"
        label="Assisted By"
        :caps="assistOptions"
        :disabled="attributes.penalty || attributes.ownGoal"
        clearable
        hide-details
      />
      <v-checkbox
        v-model="attributes.penalty"
        label="Penalty"
        :disabled="attributes.ownGoal"
        hide-details
      />
      <v-checkbox
        v-model="attributes.ownGoal"
        label="Own Goal"
        :disabled="attributes.penalty"
        hide-details
      />
      <div class="d-flex">
        <v-spacer />
        <v-btn
          type="submit"
          text="Save"
          :disabled="!formIsValid"
          color="primary"
          variant="text"
          :loading="formIsLoading"
        />
      </div>
    </div>
  </v-form>
</template>

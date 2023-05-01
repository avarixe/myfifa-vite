<script setup lang="ts">
  const props = defineProps({
    match: { type: Object, required: true },
    cap: { type: Object, required: true }
  })

  const attributes = reactive({
    playerId: props.cap.playerId,
    replacementId: '',
    injury: false
  })

  watchEffect(() => {
    attributes.playerId = props.cap.playerId
  })

  const { minute, sortedCaps } = useMatch(props.match)
  const { activePlayers } = useActivePlayers()

  const availablePlayers = computed(() => {
    const selectedIds = sortedCaps.value.map(cap => cap.playerId)
    return activePlayers.value.filter(
      player => selectedIds.indexOf(player.id) < 0
    )
  })

  const emit = defineEmits(['submitted'])
  const { form, formKey, formIsLoading, formIsValid, submitForm } = useForm({
    mutation: gql`
      mutation ($matchId: ID!, $attributes: SubstitutionAttributes!) {
        addSubstitution(matchId: $matchId, attributes: $attributes) {
          substitution {
            ...SubstitutionData
          }
        }
      }
      ${substitutionFragment}
    `,
    variables: () => ({
      matchId: props.match.id,
      attributes: { ...attributes, minute: minute.value }
    }),
    onSuccess() {
      emit('submitted')
    },
    onReset() {
      attributes.injury = false
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
      <div class="text-subtitle-2 pb-2">Substitute Player</div>
      <v-text-field v-model.number="minute" label="Minute" type="number" />
      <player-select
        v-model="attributes.replacementId"
        :players="availablePlayers"
        label="Replaced By"
        icon="mdi-subdirectory-arrow-right"
      />
      <v-checkbox v-model="attributes.injury" label="Injury" hide-details />
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

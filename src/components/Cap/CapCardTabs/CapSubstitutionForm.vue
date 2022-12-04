<script setup>
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
    return activePlayers.value.filter(player => selectedIds.indexOf(player.id) < 0)
  })

  const { executeMutation: createSubstitution } = useMutation(gql`
    mutation createSubstitution($matchId: ID!, $attributes: SubstitutionAttributes!) {
      addSubstitution(matchId: $matchId, attributes: $attributes) {
        substitution { ...SubstitutionData }
        errors { fullMessages }
      }
    }
    ${substitutionFragment}
  `)

  const emit = defineEmits(['submitted'])
  async function onSubmit () {
    const { data: { addSubstitution: { errors } } } = await createSubstitution({
      matchId: props.match.id,
      attributes: { ...attributes, minute: minute.value }
    })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      emit('submitted')
    }
  }
</script>

<template>
  <base-form
    :submit="onSubmit"
    @reset="attributes.injury = false"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Substitute Player
        </div>
        <v-text-field
          v-model.number="minute"
          label="Minute"
          type="number"
        />
        <player-select
          v-model="attributes.replacementId"
          :players="availablePlayers"
          label="Replaced By"
          icon="mdi-subdirectory-arrow-right"
        />
        <v-checkbox
          v-model="attributes.injury"
          label="Injury"
          hide-details
        />
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            color="primary"
            variant="text"
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </base-form>
</template>
<script setup lang="ts">
  import { Cap, Match, Player } from '~/models'

  const props = defineProps<{
    cap: Cap
    match: Match
  }>()

  const attributes = reactive({
    playerId: null,
    pos: props.cap.pos,
    injured: false
  })

  watchEffect(() => {
    attributes.pos = props.cap.pos
  })

  const { minute, sortedCaps } = useMatchState(props.match)
  const { activePlayers } = useActivePlayers()

  const availablePlayers = computed(() => {
    const selectedIds = sortedCaps.value.map(cap => cap.playerId)
    return activePlayers.value.filter(
      (player: Player) => selectedIds.indexOf(player.id) < 0
    )
  })

  const emit = defineEmits(['submitted'])
  const { form, formKey, formIsLoading, formIsValid, submitForm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: CapSubstitutionAttributes!) {
        substituteCap(id: $id, attributes: $attributes) {
          cap {
            ...CapData
          }
          replacement {
            ...CapData
          }
        }
      }
      ${capFragment}
    `,
    variables: () => ({
      id: props.cap.id,
      attributes: { ...attributes, minute: minute.value }
    }),
    onSuccess() {
      emit('submitted')
    },
    onReset() {
      attributes.injured = false
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
        v-model="attributes.playerId"
        :players="availablePlayers"
        label="Replaced By"
      />
      <v-select
        v-model="attributes.pos"
        label="Position"
        prepend-icon="mdi-run"
        :items="matchPositions"
      />
      <v-checkbox v-model="attributes.injured" label="Injury" hide-details />
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

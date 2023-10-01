<script setup lang="ts">
  import { Match, Cap, Player } from '~/models'

  const props = defineProps<{ match: Match }>()

  const attributes = reactive({
    playerId: null as number | null,
    pos: null as string | null,
    injured: false
  })

  const capId = ref(null as number | null)
  const capRepo = useRepo(Cap)
  watch(capId, () => {
    if (capId.value) {
      const cap = capRepo.find(capId.value)
      attributes.pos = cap?.pos || null
    }
  })

  const { activePlayers } = useActivePlayers()
  const { minute, sortedCaps } = useMatchState(props.match)

  const availablePlayers = computed(() => {
    const selectedIds = sortedCaps.value.map((cap: Cap) => cap.playerId)
    return activePlayers.value.filter((player: Player) => {
      if (!selectedIds.includes(player.id)) {
        return true
      }
    })
  })

  const unsubbedPlayers = computed(() =>
    sortedCaps.value.filter(
      cap => cap.playerId !== attributes.playerId && !cap.nextId
    )
  )

  watch(minute, () => {
    if (capId.value && sortedCaps.value.every(cap => cap.id !== capId.value)) {
      capId.value = null
    }
  })

  const mutation = gql`
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
  `
  function variables() {
    return {
      id: capId.value,
      attributes: { ...attributes, minute: minute.value }
    }
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-repeat"
    title="Record Substitution"
    :mutation="mutation"
    :variables="variables"
  >
    <v-col cols="12">
      <v-text-field v-model.number="minute" label="Minute" type="number" />
    </v-col>
    <v-col cols="12">
      <cap-select
        v-model="capId"
        :caps="unsubbedPlayers"
        label="Player"
        prepend-icon="mdi-subdirectory-arrow-left"
      />
    </v-col>
    <v-col cols="12">
      <player-select
        v-model="attributes.playerId"
        :players="availablePlayers"
        label="Replaced By"
        prepend-icon="mdi-subdirectory-arrow-right"
      />
    </v-col>
    <v-col cols="12">
      <v-select
        v-model="attributes.pos"
        label="Position"
        prepend-icon="mdi-run"
        :items="matchPositions"
      />
    </v-col>
    <v-col cols="12">
      <v-checkbox v-model="attributes.injured" label="Injury" hide-details />
    </v-col>
  </dialog-form>
</template>

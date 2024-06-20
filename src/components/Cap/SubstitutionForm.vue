<script setup lang="ts">
  import { Cap, Match, Player } from '~/models'

  interface CapSubstitutionAttributes {
    playerId: number | null
    pos: string | null
    injured: boolean
  }

  const props = defineProps<{ match: Match }>()

  const attributes = reactive<CapSubstitutionAttributes>({
    playerId: null,
    pos: null,
    injured: false
  })

  const capId = ref<number | null>(null)
  const capRepo = useRepo(Cap)
  watch(capId, () => {
    if (capId.value) {
      const cap = capRepo.find(capId.value)
      attributes.pos = cap?.pos || null
    }
  })

  const { activePlayers } = useActivePlayers()
  const { minute, sortedCaps } = useMatchState(toRef(() => props.match))

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
      <minute-field v-model="minute" :match="match" />
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

<script setup lang="ts">
  import { Match, Substitution, Cap, Player } from '~/models'

  const props = defineProps<{
    match: Match
    record?: Substitution
  }>()

  interface SubstitutionAttributes {
    capId?: number
    replacementId?: number
    injury?: boolean
  }

  const attributes: SubstitutionAttributes = reactive({})
  function onOpen() {
    attributes.capId = props.record?.playerId
    attributes.replacementId = props.record?.replacementId
    attributes.injury = props.record?.injury ?? false
    minute.value = props.record?.minute ?? null
  }

  const title = computed(
    () => `${props.record ? 'Edit' : 'Record'} Substitution`
  )

  const { activePlayers } = useActivePlayers()
  const { minute, sortedCaps } = useMatch(props.match)

  const availablePlayers = computed(() => {
    const selectedIds = sortedCaps.value.map((cap: Cap) => cap.playerId)
    return activePlayers.value.filter((player: Player) => {
      if (!selectedIds.includes(player.id)) {
        return true
      } else if (props.record) {
        return player.id === props.record.replacementId
      }
    })
  })

  const unsubbedPlayers = computed(() =>
    sortedCaps.value.filter(
      cap =>
        (cap.playerId !== attributes.replacementId && !cap.subbedOut) ||
        (props.record && cap.id === props.record.capId)
    )
  )

  watch(minute, () => {
    if (
      attributes.capId &&
      sortedCaps.value.every(cap => cap.id !== attributes.capId)
    ) {
      attributes.capId = undefined
    }
  })

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: SubstitutionAttributes!) {
          updateSubstitution(id: $id, attributes: $attributes) {
            substitution {
              ...SubstitutionData
            }
          }
        }
        ${substitutionFragment}
      `
    : gql`
        mutation ($matchId: ID!, $attributes: SubstitutionAttributes!) {
          addSubstitution(matchId: $matchId, attributes: $attributes) {
            substitution {
              ...SubstitutionData
            }
          }
        }
        ${substitutionFragment}
      `
  function variables() {
    if (props.record) {
      return {
        id: props.record.id,
        attributes: { ...attributes, minute: minute.value }
      }
    } else {
      return {
        matchId: props.match.id,
        attributes: { ...attributes, minute: minute.value }
      }
    }
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-repeat"
    :title="title"
    :validate-on-open="!!record"
    :mutation="mutation"
    :variables="variables"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="12">
        <v-text-field v-model.number="minute" label="Minute" type="number" />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-model="attributes.capId"
          :caps="unsubbedPlayers"
          label="Player"
          prepend-icon="mdi-subdirectory-arrow-left"
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="attributes.replacementId"
          :players="availablePlayers"
          label="Replaced By"
          prepend-icon="mdi-subdirectory-arrow-right"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox v-model="attributes.injury" label="Injury" hide-details />
      </v-col>
    </template>
  </dialog-form>
</template>

<script setup lang="ts">
  import { Cap, Match } from '~/models'

  const props = defineProps<{ match: Match; record?: Cap }>()

  const { minute, sortedCaps } = useMatchState(props.match)
  const { activePlayers } = useActivePlayers()

  const availablePlayers = computed(() => {
    const selectedIds = sortedCaps.value.map(cap => cap.playerId)
    return activePlayers.value.filter(
      player => !selectedIds.includes(player.id)
    )
  })

  interface CapAttributes {
    playerId?: number
    pos?: string
  }

  const attributes: CapAttributes = reactive({})
  function onOpen() {
    attributes.playerId = props.record?.playerId
    attributes.pos = props.record?.pos
    minute.value = props.record?.start || null
  }

  const capRepo = useRepo(Cap)
  const prevCap = computed(() => {
    if (props.record) {
      return capRepo.where('nextId', props.record.id).with('player').first()
    } else {
      return null
    }
  })

  const title = computed(() => (props.record ? 'Edit Substitution' : 'Add Cap'))

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: CapAttributes!) {
          updateCap(id: $id, attributes: $attributes) {
            cap {
              ...CapData
            }
          }
        }
        ${capFragment}
      `
    : gql`
        mutation ($matchId: ID!, $attributes: CapAttributes!) {
          addCap(matchId: $matchId, attributes: $attributes) {
            cap {
              ...CapData
            }
          }
        }
        ${capFragment}
      `

  function variables() {
    if (props.record) {
      return {
        id: props.record.id,
        attributes: { ...attributes, start: minute.value }
      }
    } else {
      return {
        matchId: props.match.id,
        attributes
      }
    }
  }
</script>

<template>
  <dialog-form
    :title="title"
    :validate-on-open="!!record"
    :mutation="mutation"
    :variables="variables"
    @open="onOpen"
  >
    <template v-if="record">
      <v-col cols="12">
        <v-text-field
          v-model.number="minute"
          label="Start"
          prepend-icon="mdi-timer"
          type="number"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          :model-value="prevCap?.player?.name"
          label="Player"
          prepend-icon="mdi-subdirectory-arrow-left"
          disabled
        />
      </v-col>
    </template>
    <v-col cols="12">
      <player-select
        v-model="attributes.playerId"
        :label="record ? 'Player' : 'Replaced By'"
        :players="record ? activePlayers : availablePlayers"
        item-value="id"
        :prepend-icon="`mdi-${record ? 'subdirectory-arrow-right' : 'account'}`"
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
  </dialog-form>
</template>

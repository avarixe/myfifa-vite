<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{ match: Match }>()

  const { activePlayers } = useActivePlayers()

  interface CapAttributes {
    playerId?: number
    pos?: string
  }

  const attributes: CapAttributes = reactive({})

  const mutation = gql`
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
    return {
      matchId: props.match.id,
      attributes
    }
  }
</script>

<template>
  <dialog-form title="Add Cap" :mutation="mutation" :variables="variables">
    <template #form>
      <v-col cols="12">
        <v-select
          v-model="attributes.pos"
          label="Position"
          prepend-icon="mdi-run"
          :items="Object.keys(matchPositions)"
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="attributes.playerId"
          label="Player"
          :players="activePlayers"
          item-value="id"
          prepend-icon="mdi-account"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{
    match: Match
  }>()

  interface PenaltyShootoutAttributes {
    homeScore?: number
    awayScore?: number
  }

  const attributes: PenaltyShootoutAttributes = reactive({})
  function onOpen() {
    attributes.homeScore = props.match.penaltyShootout?.homeScore
    attributes.awayScore = props.match.penaltyShootout?.awayScore
  }

  const rulesFor = {
    homeScore: [isRequired('Home Score')],
    awayScore: [isRequired('Away Score')]
  }

  const title = computed(
    () => `${props.match.penaltyShootout ? 'Edit' : 'Record'} Penalty Shootout`
  )

  const mutation = gql`
    mutation ($matchId: ID!, $attributes: PenaltyShootoutAttributes!) {
      updateMatch(
        id: $matchId
        attributes: { penaltyShootoutAttributes: $attributes }
      ) {
        match {
          ...MatchData
          penaltyShootout {
            ...PenaltyShootoutData
          }
        }
      }
    }
    ${matchFragment}
    ${penaltyShootoutFragment}
  `
  function variables() {
    return { matchId: props.match.id, attributes }
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-human"
    :title="title"
    :validate-on-open="!!match.penaltyShootout"
    :mutation="mutation"
    :variables="variables"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.homeScore"
          label="Home Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.homeScore"
          type="number"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.awayScore"
          label="Away Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.awayScore"
          type="number"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

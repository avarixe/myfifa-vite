<script setup lang="ts">
  defineProps<{ teamId: string }>()

  const { currentSeason, ready } = useTeamQuery({
    query: gql`
      query fetchCompetitionsPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          competitions {
            ...CompetitionData
          }
        }
      }
      ${teamFragment}
      ${competitionFragment}
    `
  })

  const { smAndDown } = useDisplay()
</script>

<template>
  <div class="text-h4 mb-2">Competitions</div>

  <v-timeline v-if="ready" :side="smAndDown ? 'end' : null">
    <v-timeline-item
      v-for="season in [...Array(currentSeason + 1).keys()].reverse()"
      :key="season"
      dot-color="primary"
    >
      <template #icon>{{ season + 1 }}</template>
      <competition-list :season="season" />
    </v-timeline-item>
  </v-timeline>
</template>

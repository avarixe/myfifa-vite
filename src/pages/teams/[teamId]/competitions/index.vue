<script setup>
  const { team, currentSeason } = await useTeamQuery({
    query: gql`
      query fetchCompetitionsPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          competitions { ...CompetitionData }
        }
      }
      ${teamFragment}
      ${competitionFragment}
    `
  })

  const { smAndDown } = useDisplay()
</script>

<template>
  <h1>Competitions</h1>

  <v-timeline :side="smAndDown ? 'end' : null">
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

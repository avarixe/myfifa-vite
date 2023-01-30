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

  const $q = useQuasar()
</script>

<template>
  <h3 class="text-h3">Competitions</h3>

  <q-timeline :layout="$q.screen.lt.md ? 'dense' : 'loose'">
    <q-timeline-entry
      v-for="season in [...Array(currentSeason + 1).keys()].reverse()"
      :key="season"
      :title="`Season ${season + 1}`"
      :side="season % 2 === 0 ? 'right' : 'left'"
    >
      <competition-list :season="season" />
    </q-timeline-entry>
  </q-timeline>
</template>

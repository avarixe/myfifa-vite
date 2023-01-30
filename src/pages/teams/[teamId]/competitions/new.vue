<script setup>
  const { teamId } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          competitions { ...CompetitionData }
        }
      }
      ${teamFragment}
      ${competitionFragment}
    `
  })
</script>

<template>
  <h3 class="text-h3">New Competition</h3>

  <competition-form :team-id="teamId" />
</template>

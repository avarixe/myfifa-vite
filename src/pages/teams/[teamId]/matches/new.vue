<script setup>
  const { teamId } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          competitions {
            ...CompetitionData
            stages { ...BaseStageData }
          }
        }
      }
      ${teamFragment}
      ${competitionFragment}
      ${baseStageFragment}
    `
  })
</script>

<template>
  <h1>New Match</h1>

  <match-form :team-id="teamId" />
</template>

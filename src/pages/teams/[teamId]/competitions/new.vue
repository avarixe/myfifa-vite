<script setup>
  const { teamId } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
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
</script>

<template>
  <div class="text-h4 mb-2">New Competition</div>

  <competition-form :team-id="teamId" />
</template>

<script setup>
  const { teamId } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
        }
      }
      ${teamFragment}
    `
  })
</script>

<template>
  <div class="text-h4 mb-2">New Player</div>

  <player-form :team-id="teamId" />
</template>

<script setup>
  const { team } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) { ...TeamData }
      }
      ${teamFragment}
    `
  })
</script>

<template>
  <h3 class="text-h3">Edit Team</h3>

  <team-form :record="team" />
</template>

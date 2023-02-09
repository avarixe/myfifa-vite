<script setup>
  const { team } = await useTeamQuery({
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
  <h1>Edit Team</h1>

  <team-form :record="team" />
</template>

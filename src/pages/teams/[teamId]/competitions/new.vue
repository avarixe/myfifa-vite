<script setup>
  const { teamId } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) { ...TeamData }
      }
      ${teamFragment}
    `
  })
</script>

<template>
  <h1>New Competition</h1>

  <competition-form :team-id="teamId" />
</template>

<script setup>
  import { useTeamQuery } from '~/composables'
  import { teamFragment } from '~/fragments'

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
  <router-link :to="`/teams/${teamId}`">Back</router-link>

  <h1>New Player</h1>

  <player-form :team-id="teamId" />
</template>

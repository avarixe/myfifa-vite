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
  <router-link :to="`/teams/${teamId}/matches`">Back</router-link>

  <h1>New Match</h1>

  <match-form :team-id="teamId" />
</template>

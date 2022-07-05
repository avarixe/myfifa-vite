<script setup>
  import { useTeamQuery } from '~/composables'
  import { teamFragment } from '~/fragments'

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
  <router-link :to="`/teams/${team.id}`">Back</router-link>

  <h1>Edit Team</h1>

  <team-form :team="team" />
</template>

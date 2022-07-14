<script setup>
  import { formatDate } from '~/filters'
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
  <div>
    <router-link to="/teams">Back</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/edit`">Edit</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/players`">Players</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/matches`">Matches</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/squads`">Squads</router-link>
  </div>

  <h1>Team Dashboard</h1>

  <div><b>Start Date:</b> {{ formatDate(team.startedOn) }}</div>
  <div><b>Current Date:</b> {{ formatDate(team.currentlyOn) }}</div>
  <div><b>Currency:</b> {{ team.currency }}</div>
</template>

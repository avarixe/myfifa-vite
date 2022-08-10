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
  <h1>{{ team.name }}</h1>

  <div>
    <v-btn :to="`/teams/${team.id}/edit`">Edit</v-btn>
    &nbsp;
    <v-btn :to="`/teams/${team.id}/players`">Players</v-btn>
    &nbsp;
    <v-btn :to="`/teams/${team.id}/matches`">Matches</v-btn>
    &nbsp;
    <v-btn :to="`/teams/${team.id}/squads`">Squads</v-btn>
    &nbsp;
    <v-btn :to="`/teams/${team.id}/competitions`">Competitions</v-btn>
  </div>

  <div class="mt-2">
    <div><b>Start Date:</b> {{ formatDate(team.startedOn) }}</div>
    <div><b>Current Date:</b> {{ formatDate(team.currentlyOn) }}</div>
    <div><b>Currency:</b> {{ team.currency }}</div>
  </div>
</template>

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
  <router-link to="/teams">Back</router-link>

  <img :src="team.badgeUrl" :style="{ objectFit: 'contain', height: '100px' }" />

  <h1>{{ team.name }}</h1>
  <div><b>Start Date:</b> {{ formatDate(team.startedOn) }}</div>
  <div><b>Current Date:</b> {{ formatDate(team.currentlyOn) }}</div>
  <div><b>Currency:</b> {{ team.currency }}</div>

  <ul>
    <li><router-link :to="`/teams/${team.id}/edit`">Edit</router-link></li>
    <li><router-link :to="`/teams/${team.id}/players`">Players</router-link></li>
  </ul>
</template>

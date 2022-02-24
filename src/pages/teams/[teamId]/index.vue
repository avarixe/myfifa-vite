<script setup>
  import { format, parseISO } from 'date-fns'
  import { useTeamQuery } from '~/composables'
  import { teamFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = useTeamQuery({
    query: gql`
      query fetchTeamPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
        }
      }
      ${teamFragment}
    `
  })
</script>

<template>
  <router-link to="/teams">Teams</router-link>
  <template v-if="team">
    <div><b>Name:</b> {{ team.name }}</div>
    <div>
      <b>Current Date:</b>
      {{ format(parseISO(team.currentlyOn), 'MMM dd, yyyy') }}
    </div>
    <div><b>Currency:</b> {{ team.currency }}</div>
    <div>
      <b>Start Date:</b>
      {{ format(parseISO(team.startedOn), 'MMM dd, yyyy') }}
    </div>
    <div>
      <router-link :to="`/teams/${team.id}/players`">Players</router-link>
      <router-link :to="`/teams/${team.id}/matches`">Matches</router-link>
    </div>
  </template>
</template>

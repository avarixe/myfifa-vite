<script setup>
  import { format, parseISO } from 'date-fns'
  import { useNavigationStore } from '~/store/navigation'
  import { useTeamQuery } from '~/composables'
  import { teamFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = await useTeamQuery({
    query: gql`
      query fetchTeamPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
        }
      }
      ${teamFragment}
    `
  })

  const navigationStore = useNavigationStore()
  navigationStore.setBreadcrumbs([
    { icon: 'mdi-home', to: '/' },
    { label: 'Teams', to: '/teams' },
    { label: team.value.name, to: `/teams/${props.teamId}` }
  ])
</script>

<template>
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
    <router-link :to="`/teams/${team.id}/squads`">Squads</router-link>
    <router-link :to="`/teams/${team.id}/competitions`">Competitions</router-link>
  </div>
</template>

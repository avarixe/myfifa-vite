<script setup>
  import { Match } from '~/models'
  import { useTeamQuery } from '~/composables'
  import { matchFragment, teamFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true },
    matchId: { type: String, required: true }
  })

  const { data } = await useTeamQuery({
    query: gql`
      query fetchMatchPage($teamId: ID!, $matchId: ID!) {
        match(id: $matchId) { ...MatchData }
        team(id: $teamId) { ...TeamData }
      }
      ${matchFragment}
      ${teamFragment}
    `,
    variables: {
      teamId: props.teamId,
      matchId: props.matchId
    }
  })
  const matchRepo = useRepo(Match)
  matchRepo.save(data.value?.match)
  const match = computed(() =>
    matchRepo.find(parseInt(props.matchId))
  )
</script>

<template>
  <router-link :to="`/teams/${props.teamId}/matches/${match.id}`">Back</router-link>

  <h1>Edit Match</h1>

  <match-form :record="match" />
</template>

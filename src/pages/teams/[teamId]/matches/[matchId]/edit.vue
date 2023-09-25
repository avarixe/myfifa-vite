<script setup lang="ts">
  import { Match } from '~/models'

  const route = useRoute<'/teams/[teamId]/matches/[matchId]/edit'>()

  const { data } = await useTeamQuery<{ team: object; match: object }>({
    query: gql`
      query fetchMatchPage($teamId: ID!, $matchId: ID!) {
        match(id: $matchId) {
          ...MatchData
        }
        team(id: $teamId) {
          ...TeamData
          competitions {
            ...CompetitionData
            stages {
              ...BaseStageData
            }
          }
        }
      }
      ${matchFragment}
      ${teamFragment}
      ${competitionFragment}
      ${baseStageFragment}
    `,
    variables: {
      teamId: route.params.teamId,
      matchId: route.params.matchId
    }
  })
  const matchRepo = useRepo(Match)
  if (data.value?.match) {
    matchRepo.save(data.value.match)
  }
  const match = computed(
    () => matchRepo.find(Number(route.params.matchId)) as Match
  )
</script>

<template>
  <div class="text-h4 mb-2">Edit Match</div>

  <match-form :record="match" />
</template>

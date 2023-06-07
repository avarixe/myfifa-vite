<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{ teamId: string; matchId: string }>()

  const matchRepo = useRepo(Match)
  const match = computed(() => matchRepo.find(parseInt(props.matchId)))

  const { ready } = useTeamQuery({
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
    variables: () => ({
      teamId: parseInt(props.teamId),
      matchId: parseInt(props.matchId)
    }),
    onQuery(data) {
      matchRepo.save(data.match)
    }
  })
</script>

<template>
  <div class="text-h4 mb-2">Edit Match</div>

  <match-form v-if="ready" :record="match" />
</template>

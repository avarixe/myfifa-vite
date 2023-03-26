<script setup lang="ts">
  const props = defineProps({
    teamId: { type: String, required: true },
    matchId: { type: String, required: true }
  })

  const { data } = await useTeamQuery({
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
      teamId: props.teamId,
      matchId: props.matchId
    }
  })
  const matchRepo = useRepo(Match)
  matchRepo.save(data.value?.match)
  const match = computed(() => matchRepo.find(parseInt(props.matchId)))
</script>

<template>
  <div class="text-h4 mb-2">Edit Match</div>

  <match-form :record="match" />
</template>

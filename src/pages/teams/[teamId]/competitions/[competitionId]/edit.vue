<script setup lang="ts">
  import { Competition } from '~/models'

  const route = useRoute<'/teams/[teamId]/competitions/[competitionId]/edit'>()

  const { data } = await useTeamQuery({
    query: gql`
      query fetchCompetitionPage($teamId: ID!, $competitionId: ID!) {
        competition(id: $competitionId) {
          ...CompetitionData
          stages {
            ...StageData
          }
        }
        team(id: $teamId) {
          ...TeamData
          competitions {
            ...CompetitionData
          }
        }
      }
      ${competitionFragment}
      ${stageFragment}
      ${teamFragment}
    `,
    variables: {
      teamId: route.params.teamId,
      competitionId: route.params.competitionId
    }
  })

  const competitionRepo = useRepo(Competition)
  competitionRepo.save(data.value?.competition)
  const { competition } = useCompetition(parseInt(route.params.competitionId))
</script>

<template>
  <div class="text-h4 mb-2">Edit Competition</div>

  <competition-form :record="competition" />
</template>

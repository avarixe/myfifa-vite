<script setup lang="ts">
  import { Competition } from '~/models'

  const props = defineProps<{
    teamId: string
    competitionId: string
  }>()

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
      teamId: props.teamId,
      competitionId: props.competitionId
    }
  })

  const competitionRepo = useRepo(Competition)
  competitionRepo.save(data.value?.competition)
  const { competition } = useCompetition(parseInt(props.competitionId))
</script>

<template>
  <div class="text-h4 mb-2">Edit Competition</div>

  <competition-form :record="competition" />
</template>

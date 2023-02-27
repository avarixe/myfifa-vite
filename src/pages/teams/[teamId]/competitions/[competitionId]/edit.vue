<script setup>
  const props = defineProps({
    teamId: { type: String, required: true },
    competitionId: { type: String, required: true }
  })

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
  <h1>Edit Competition</h1>

  <competition-form :record="competition" />
</template>

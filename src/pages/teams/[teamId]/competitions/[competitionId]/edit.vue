<script setup>
  import { Competition } from '~/models'
  import { useTeamQuery } from '~/composables'
  import { competitionFragment, teamFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true },
    competitionId: { type: String, required: true }
  })

  const { data } = await useTeamQuery({
    query: gql`
      query fetchCompetitionPage($teamId: ID!, $competitionId: ID!) {
        competition(id: $competitionId) { ...CompetitionData }
        team(id: $teamId) { ...TeamData }
      }
      ${competitionFragment}
      ${teamFragment}
    `,
    variables: {
      teamId: props.teamId,
      competitionId: props.competitionId
    }
  })
  const competitionRepo = useRepo(Competition)
  competitionRepo.save(data.value?.competition)
  const competition = computed(() =>
    competitionRepo.find(parseInt(props.competitionId))
  )
</script>

<template>
  <router-link :to="`/teams/${props.teamId}/competitions/${competition.id}`">Back</router-link>

  <h1>Edit Competition</h1>

  <competition-form :record="competition" />
</template>

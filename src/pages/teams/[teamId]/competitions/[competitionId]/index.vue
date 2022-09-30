<script setup>
  import { Competition } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true },
    competitionId: { type: String, required: true }
  })

  const { data, team, seasonLabel } = await useTeamQuery({
    query: gql`
      query fetchCompetitionPage($teamId: ID!, $competitionId: ID!) {
        team(id: $teamId) { ...TeamData }
        competition(id: $competitionId) {
          ...CompetitionData
          stages { ...StageData }
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
  const competition = computed(() =>
    competitionRepo.withAll().find(parseInt(props.competitionId))
  )

  const router = useRouter()
</script>

<template>
  <h1>{{ competition.name }}</h1>

  <div>
    <v-btn :to="`/teams/${team.id}/competitions/${competition.id}/edit`">Edit</v-btn>
    &nbsp;
    <remove-button
      :record="competition"
      store="Competition"
      :label="competition.name"
      @removed="router.push(`/teams/${team.id}/competitions`)"
    />
  </div>

  <div class="mt-2">
    <div><b>Season:</b> {{ seasonLabel(competition.season) }}</div>
    <div v-if="competition.champion"><b>Champion:</b> {{ competition.champion }}</div>
  </div>

  <h3><u>Stages</u></h3>
  <p>Coming Soon!</p>
  <!-- <stage-grid :stage="stage" /> -->
</template>

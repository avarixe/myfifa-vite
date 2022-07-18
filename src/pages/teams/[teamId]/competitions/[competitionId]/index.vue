<script setup>
  import { useTeamQuery } from '~/composables'
  import { Competition } from '~/models'
  import {
    competitionFragment,
    stageFragment,
    teamFragment
  } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true },
    competitionId: { type: String, required: true }
  })

  const { data, team } = await useTeamQuery({
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
  <div>
    <router-link :to="`/teams/${team.id}/competitions`">Back</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/competitions/${competition.id}/edit`">Edit</router-link>
    &nbsp;
    <remove-button
      :record="competition"
      store="Competition"
      :label="competition.name"
      @removed="router.push(`/teams/${team.id}/competitions`)"
    />
  </div>

  <h1>{{ competition.name }}</h1>

  <div><b>Season:</b> {{ competition.season }}</div>
  <div v-if="competition.champion"><b>Champion:</b> {{ competition.champion }}</div>

  <h3><u>Stages</u></h3>
  <p>Coming Soon!</p>
  <!-- <stage-grid :stage="stage" /> -->
</template>

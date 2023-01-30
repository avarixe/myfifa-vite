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
  const { competition, orderedRounds } = useCompetition(parseInt(props.competitionId))

  const tableStages = computed(() => competition.value.stages.filter(stage => stage.table))

  const router = useRouter()

  const addStageDialog = ref(false)
</script>

<template>
  <h3 class="text-h3">{{ competition.name }}</h3>

  <div>
    <q-btn :to="`/teams/${team.id}/competitions/${competition.id}/edit`">Edit</q-btn>
    &nbsp;
    <q-btn @click="addStageDialog = true">Add Stage</q-btn>
    <stage-form
      v-model="addStageDialog"
      :competition-id="competition.id"
    />
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

  <q-expansion-item
    v-if="tableStages.length > 0"
    label="Group Stages"
    default-opened
    class="my-4"
  >
    <stage-grid :stages="tableStages" />
  </q-expansion-item>
  <q-expansion-item
    v-if="orderedRounds.length > 0"
    label="Knockout Stages"
    default-opened
    class="my-4"
  >
    <stage-grid :stages="orderedRounds" />
  </q-expansion-item>
</template>

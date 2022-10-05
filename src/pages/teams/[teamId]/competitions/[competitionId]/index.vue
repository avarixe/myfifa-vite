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
    competitionRepo.with('stages', query =>
      query
        .with('tableRows')
        .with('fixtures', fixtureQuery => fixtureQuery.with('legs'))
    ).find(parseInt(props.competitionId))
  )

  const tableStages = computed(() => competition.value.stages.filter(stage => stage.table))
  const roundStages = computed(() => competition.value.stages.filter(stage => !stage.table))

  const router = useRouter()

  const expansionPanels = ref([0, 1])
</script>

<template>
  <h1>{{ competition.name }}</h1>

  <div>
    <v-btn :to="`/teams/${team.id}/competitions/${competition.id}/edit`">Edit</v-btn>
    &nbsp;
    <v-btn>
      Add Stage
      <stage-form :competition-id="competition.id" />
    </v-btn>
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

  <v-expansion-panels v-model="expansionPanels" multiple>
    <v-expansion-panel
      v-if="tableStages.length > 0"
      title="Group Stages"
    >
      <v-expansion-panel-text>
        <stage-grid :stages="tableStages" />
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel
      v-if="roundStages.length > 0"
      title="Knockout Stages"
    >
      <v-expansion-panel-text>
        <stage-grid :stages="roundStages" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

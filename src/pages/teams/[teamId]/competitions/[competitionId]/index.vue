<script setup>
  const props = defineProps({
    teamId: { type: String, required: true },
    competitionId: { type: String, required: true }
  })

  const { data, team, seasonLabel } = await useTeamQuery({
    query: gql`
      query fetchCompetitionPage($teamId: ID!, $competitionId: ID!) {
        team(id: $teamId) {
          ...TeamData
        }
        competition(id: $competitionId) {
          ...CompetitionData
          stages {
            ...StageData
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
  const { competition, orderedRounds } = useCompetition(
    parseInt(props.competitionId)
  )

  const tableStages = computed(() =>
    competition.value.stages.filter(stage => stage.table)
  )

  const router = useRouter()

  const expansionPanels = ref([0, 1])

  const readonly = ref(false)
  watchEffect(() => {
    readonly.value = !!competition.value.champion
  })

  const matchesFilters = computed(() => ({
    season: competition.value.season,
    competition: competition.value.name,
    stage: null,
    team: null,
    result: ['win', 'draw', 'loss']
  }))
</script>

<template>
  <v-btn
    :to="`/teams/${team.id}/seasons/${competition.season}`"
    variant="text"
    color="primary"
    class="pa-0"
  >
    {{ seasonLabel(competition.season) }}
  </v-btn>
  <div class="text-h4">{{ competition.name }}</div>
  <div v-if="competition.champion" class="text-body-1">
    <v-icon start color="warning">mdi-trophy</v-icon>
    {{ competition.champion }}
    <v-icon end color="warning">mdi-trophy</v-icon>
  </div>

  <div class="my-2">
    <div>
      <v-switch
        v-model="readonly"
        label="Readonly Mode"
        color="primary"
        hide-details
        class="d-inline-block"
      />
    </div>
    <template v-if="!readonly">
      <v-btn :to="`/teams/${team.id}/competitions/${competition.id}/edit`">
        Edit
      </v-btn>
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
    </template>
  </div>

  <section id="matches" class="mt-4">
    <div class="text-h4 mb-2 text-primary font-weight-light">
      <v-icon start large>mdi-table</v-icon>
      Stages
    </div>

    <v-expansion-panels v-model="expansionPanels" multiple>
      <v-expansion-panel v-if="tableStages.length > 0" title="Group Stages">
        <v-expansion-panel-text>
          <stage-grid :stages="tableStages" :readonly="readonly" />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel
        v-if="orderedRounds.length > 0"
        title="Knockout Stages"
      >
        <v-expansion-panel-text>
          <stage-grid :stages="orderedRounds" :readonly="readonly" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </section>

  <section id="matches" class="mt-4">
    <div class="text-h4 mb-2 text-primary font-weight-light">
      <v-icon start large>mdi-soccer-field</v-icon>
      Matches
    </div>

    <matches-table :filters="matchesFilters" />
  </section>
</template>

<script setup lang="ts">
  import { Competition } from '~/models'

  const route = useRoute<'/teams/[teamId]/competitions/[competitionId]/edit'>()

  const { data, team, seasonLabel } = await useTeamQuery<{
    team: object
    competition: object
  }>({
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
      teamId: route.params.teamId,
      competitionId: route.params.competitionId
    }
  })
  const competitionRepo = useRepo(Competition)
  if (data.value?.competition) {
    competitionRepo.save(data.value.competition)
  }
  const { competition, orderedRounds } = useCompetition(
    Number(route.params.competitionId)
  )

  const tableStages = computed(() =>
    competition.value.stages.filter(stage => stage.table)
  )

  const router = useRouter()

  const expansionPanels = ref([0, 1])

  const readonlyMode = ref(false)
  watchEffect(() => {
    readonlyMode.value = !!competition.value?.champion
  })

  const matchesFilters: Ref<MatchFilters> = computed(() => ({
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
    :text="seasonLabel(competition.season)"
    variant="text"
    color="primary"
    class="pa-0"
  />
  <div class="text-h4">{{ competition.name }}</div>
  <div v-if="competition.champion" class="text-body-1">
    <v-icon start color="warning">mdi-trophy</v-icon>
    {{ competition.champion }}
    <v-icon end color="warning">mdi-trophy</v-icon>
  </div>

  <div class="my-2">
    <div>
      <v-switch
        v-model="readonlyMode"
        label="Readonly Mode"
        color="primary"
        hide-details
        class="d-inline-block"
      />
    </div>
    <template v-if="!readonlyMode">
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
      <v-icon start>mdi-table</v-icon>
      Stages
    </div>

    <v-expansion-panels v-model="expansionPanels" multiple>
      <v-expansion-panel v-if="tableStages.length > 0" title="Group Stages">
        <v-expansion-panel-text>
          <stage-grid :stages="tableStages" :readonly="readonlyMode" />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel
        v-if="orderedRounds.length > 0"
        title="Knockout Stages"
      >
        <v-expansion-panel-text>
          <stage-grid :stages="orderedRounds" :readonly="readonlyMode" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </section>

  <section id="matches" class="mt-4">
    <div class="text-h4 mb-2 text-primary font-weight-light">
      <v-icon start>mdi-soccer-field</v-icon>
      Matches
    </div>

    <matches-table :filters="matchesFilters" />
  </section>
</template>

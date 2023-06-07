<script setup lang="ts">
  defineProps<{ teamId: string }>()

  const matchCompetitions = ref([])
  const matchStages = ref([])
  const { team, currentSeason, seasonLabel, ready } = useTeamQuery({
    query: gql`
      query fetchMatchesPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          competitions {
            id
            name
            stages {
              id
              name
              table
            }
          }
        }
      }
      ${teamFragment}
    `,
    onTeamQuery(data) {
      matchCompetitions.value =
        [...new Set(data.team.competitions.map(comp => comp.name))]
          .filter(comp => !!comp)
          .sort()
      const stageNames = data.team.competitions.reduce(
        (names, comp) => [
          ...names,
          ...comp.stages.filter(stage => !stage.table).map(stage => stage.name)
        ],
        []
      )
      matchStages.value = [...new Set(stageNames)].filter(stage => !!stage).sort()
    }
  })

  const filters = reactive({
    season: null,
    competition: null,
    stage: null,
    team: null,
    result: ['win', 'draw', 'loss']
  })

  const seasonOptions = computed(() =>
    [...Array(currentSeason.value + 1).keys()].map(
      season => ({
        title: seasonLabel(season),
        value: season
      })
    )
  )
</script>

<template>
  <template v-if="ready">
    <div class="text-h4">Matches</div>

    <v-btn :to="`/teams/${team.id}/matches/new`">
      <v-icon start>mdi-plus</v-icon>
      Match
    </v-btn>

    <div class="d-flex mt-2">
      <v-select
        v-model="filters.season"
        label="Season"
        :items="seasonOptions"
        density="compact"
        clearable
        hide-details
      />
      <v-spacer />
      <v-autocomplete
        v-model="filters.competition"
        label="Competition"
        :items="matchCompetitions"
        density="compact"
        clearable
        hide-details
      />
      <v-spacer />
      <v-combobox
        v-model="filters.stage"
        label="Stage"
        :items="matchStages"
        density="compact"
        clearable
        hide-details
      />
    </div>
    <div class="d-flex my-2">
      <team-combobox
        v-model="filters.team"
        label="Team"
        density="compact"
        clearable
        hide-details
      />
      <v-spacer />
      <v-btn-toggle
        v-model="filters.result"
        multiple
        variant="outlined"
        density="comfortable"
      >
        <v-btn icon="mdi-alpha-w" value="win" color="success" />
        <v-btn icon="mdi-alpha-d" value="draw" color="warning" />
        <v-btn icon="mdi-alpha-l" value="loss" color="error" />
      </v-btn-toggle>
    </div>

    <matches-table :filters="filters" />
  </template>
</template>

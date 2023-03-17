<script setup>
  const {
    team,
    currentSeason,
    seasonLabel,
    data: queryData
  } = await useTeamQuery({
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
    `
  })

  const filters = reactive({
    season: null,
    competition: null,
    stage: null,
    team: null,
    result: ['win', 'draw', 'loss']
  })

  const options = ref({
    page: 0,
    itemsPerPage: 10,
    sortBy: 'playedOn',
    sortDesc: true
  })

  const { data, executeQuery } = useQuery({
    query: gql`
      query (
        $teamId: ID!
        $pagination: PaginationAttributes
        $filters: MatchFilterAttributes
      ) {
        team(id: $teamId) {
          matchSet(pagination: $pagination, filters: $filters) {
            matches {
              ...MatchData
            }
            total
          }
        }
      }
      ${matchFragment}
    `,
    variables: {
      teamId: team.value.id,
      pagination: options,
      filters
    },
    pause: true
  })

  const matchRepo = useRepo(Match)
  const matches = ref([])
  const serverItemsLength = ref(0)
  const loading = ref(false)
  async function fetchPage() {
    try {
      loading.value = true
      await executeQuery()
      const {
        team: { matchSet }
      } = data.value
      matchRepo.save(matchSet.matches)
      const matchIds = matchSet.matches.map(match => parseInt(match.id))
      matches.value = matchRepo
        .with('team')
        .where('id', matchIds)
        .orderBy(match => matchIds.indexOf(match.id))
        .get()
      serverItemsLength.value = matchSet.total
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  onMounted(fetchPage)

  const fetchTimeout = ref(null)
  function onTableUpdate() {
    console.log('triggered table update')
    clearTimeout(fetchTimeout.value)
    fetchTimeout.value = setTimeout(fetchPage, 300)
  }
  watch(options, onTableUpdate, { deep: true })
  watch(filters, onTableUpdate, { deep: true })

  const headers = [
    { value: 'name', text: 'Match', class: 'text-center', sortable: false },
    { value: 'competition', text: 'Competition' },
    { value: 'playedOn', text: 'Date Played' },
    { value: 'link', text: 'Link', class: 'text-center', sortable: false }
  ]

  const seasonOptions = [...Array(currentSeason.value + 1).keys()].map(
    season => ({
      title: seasonLabel(season),
      value: season
    })
  )

  const matchCompetitions = computed(() =>
    [...new Set(queryData.value.team.competitions.map(comp => comp.name))]
      .filter(comp => !!comp)
      .sort()
  )

  const matchStages = computed(() => {
    const stageNames = queryData.value.team.competitions.reduce(
      (names, comp) => [
        ...names,
        ...comp.stages.filter(stage => !stage.table).map(stage => stage.name)
      ],
      []
    )
    return [...new Set(stageNames)].filter(stage => !!stage).sort()
  })
</script>

<template>
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

  <data-table
    v-model:options="options"
    :headers="headers"
    :items="matches"
    :loading="loading"
    :server-items-length="serverItemsLength"
  >
    <template #item="{ item: match }">
      <td :style="{ textAlign: 'center' }">
        <div>{{ match.home }} v {{ match.away }}</div>
        <div :class="`text-${match.resultColor}`">
          {{ match.score }}
          <span v-if="match.extraTime" class="text-caption">aet.</span>
        </div>
      </td>
      <td>
        <div>{{ match.competition }}</div>
        <i v-if="match.stage">{{ match.stage }}</i>
      </td>
      <td>{{ formatDate(match.playedOn) }}</td>
      <td>
        <v-btn
          color="primary"
          block
          :to="`/teams/${team.id}/matches/${match.id}`"
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </td>
    </template>
  </data-table>
</template>

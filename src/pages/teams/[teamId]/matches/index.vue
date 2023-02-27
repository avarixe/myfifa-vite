<script setup>
  const { team, currentSeason, seasonLabel } = await useTeamQuery({
    query: gql`
      query fetchMatchesPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          matches {
            ...MatchData
          }
        }
      }
      ${teamFragment}
      ${matchFragment}
    `
  })

  const filters = reactive({
    season: null,
    competition: null,
    stage: null,
    team: null,
    result: ['win', 'draw', 'loss']
  })

  const matchRepo = useRepo(Match)
  const matches = computed(() =>
    matchRepo
      .with('team')
      .where('teamId', team.value.id)
      .where(
        match =>
          !filters.team ||
          match.home.toLowerCase().includes(filters.team.toLowerCase()) ||
          match.away.toLowerCase().includes(filters.team.toLowerCase())
      )
      .where(
        'season',
        season => filters.season === null || filters.season === season
      )
      .where(
        'competition',
        comp => !filters.competition || filters.competition === comp
      )
      .where('stage', stage => !filters.stage || filters.stage === stage)
      .where('teamResult', teamResult => filters.result.includes(teamResult))
      .get()
  )

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
    [...new Set(matches.value.map(match => match.competition))]
      .filter(comp => !!comp)
      .sort()
  )

  const matchStages = computed(() =>
    [...new Set(matches.value.map(match => match.stage))]
      .filter(stage => !!stage)
      .sort()
  )
</script>

<template>
  <h1>Matches</h1>

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
    <v-autocomplete
      v-model="filters.stage"
      label="Stage"
      :items="matchStages"
      density="compact"
      clearable
      hide-details
    />
  </div>
  <div class="d-flex mt-2">
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
    :headers="headers"
    :items="matches"
    item-key="id"
    sort-by="playedOn"
    sort-desc
  >
    <template #item="{ item: match }">
      <td :style="{ textAlign: 'center' }">
        <div>{{ match.home }} v {{ match.away }}</div>
        <div :class="`text-${match.resultColor}`">{{ match.score }}</div>
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

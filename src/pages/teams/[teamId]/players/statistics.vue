<script setup lang="ts">
  import { Player, Competition } from '~/models'

  const { data, team, currentSeason, seasonLabel } = await useTeamQuery({
    query: gql`
      query fetchPlayersPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players {
            ...PlayerData
          }
          playerPerformanceStats {
            ...PlayerPerformanceStatsData
          }
          competitions {
            ...CompetitionData
          }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${playerPerformanceStatsFragment}
      ${competitionFragment}
    `
  })

  const { playerPerformanceStats } = data.value.team
  const statsByPlayerId = _groupBy(playerPerformanceStats, 'playerId')

  const filter = ref('Active')
  const filterOptions = [
    { text: 'All', color: 'blue', icon: 'earth' },
    { text: 'Youth', color: 'cyan', icon: 'school' },
    { text: 'Active', color: 'light-green', icon: 'account-check' }
  ]

  const headers = computed(() => {
    const playerHeaders: TableHeader[] = [
      { title: 'Name', key: 'player.name', width: 200, fixed: true },
      {
        title: 'Nationality',
        key: 'player.nationality',
        align: 'center',
        width: 80
      },
      { title: 'Pos', key: 'player.pos', align: 'center' }
    ]

    if (splitSeason.value) {
      playerHeaders.push({
        title: 'Season',
        key: 'season',
        width: 120
      })
    }
    if (splitCompetition.value) {
      playerHeaders.push({
        title: 'Competition',
        key: 'competition',
        width: 200
      })
    }

    return [
      ...playerHeaders,
      { title: 'GP', key: 'numMatches', align: 'end' },
      { title: 'Minutes', key: 'numMinutes', align: 'end' },
      { title: 'G', key: 'numGoals', align: 'end' },
      { title: 'A', key: 'numAssists', align: 'end' },
      { title: 'CS', key: 'numCleanSheets', align: 'end' },
      { title: 'Rating', key: 'avgRating' },
      { title: 'xG + xA', key: 'xGAndxA', align: 'end' },
      { title: 'xG', key: 'xG', align: 'end' },
      { title: 'xA', key: 'xA', align: 'end' }
    ]
  })

  const sortBy = ref([{ key: 'player.pos', order: 'asc' }])

  const filters = reactive({
    season: null,
    competition: null
  })

  const splitSeason = ref(false)
  const splitCompetition = ref(false)

  const playerRepo = useRepo(Player)
  const players = computed(() =>
    playerRepo
      .where('teamId', team.value.id)
      .get()
      .filter(player => {
        switch (filter.value) {
          case 'All':
            return true
          case 'Youth':
            return player.youth
          case 'Active':
            return player.status !== null && player.status !== 'Pending'
        }
      })
  )

  interface PlayerWithStats {
    id: string | number
    player: Player
    season?: number
    competition?: string
    numMatches: number
    numMinutes: number
    numGoals: number
    numAssists: number
    numCleanSheets: number
    avgRating: number
    xG: number
    xA: number
    xGAndxA: number
  }
  const items: Ref<PlayerWithStats[]> = computed(() => {
    const rows = []
    players.value.forEach(player => {
      const filteredStats =
        statsByPlayerId[player.id]?.filter(
          data =>
            [null, data.season].includes(filters.season) &&
            [null, data.competition].includes(filters.competition)
        ) || []

      const splitStats = _groupBy(filteredStats, stats =>
        [
          stats.playerId,
          splitSeason.value ? stats.season : null,
          splitCompetition.value ? stats.competition : null
        ].join('_')
      )

      for (const key in splitStats) {
        const matchStats = {
          numMatches: 0,
          numMinutes: 0,
          numGoals: 0,
          numAssists: 0,
          numCleanSheets: 0,
          avgRating: 0,
          xG: 0,
          xA: 0,
          xGAndxA: 0
        }
        let numRatedMinutes = 0

        splitStats[key].forEach(data => {
          for (const metric in matchStats) {
            if (metric === 'avgRating') {
              if (data.avgRating > 0) {
                numRatedMinutes += data.numMinutes
                matchStats.avgRating += data.avgRating * data.numMinutes
              }
            } else {
              matchStats[metric] += data[metric]
            }
          }
        })

        if (matchStats.numMinutes > 0) {
          matchStats.xG = (matchStats.numGoals / matchStats.numMinutes) * 90
          matchStats.xA = (matchStats.numAssists / matchStats.numMinutes) * 90
          matchStats.xGAndxA = matchStats.xG + matchStats.xA
        }
        matchStats.avgRating /= numRatedMinutes || 1

        rows.push({
          id: key,
          player,
          season: splitStats[key][0].season,
          competition: splitStats[key][0].competition,
          ...matchStats
        })
      }
    })
    return rows
  })

  const seasonOptions = [...Array(currentSeason.value + 1).keys()].map(
    season => ({
      title: seasonLabel(season),
      value: season
    })
  )

  const competitionRepo = useRepo(Competition)
  const competitionNames = computed(() => [
    ...new Set(
      competitionRepo
        .where('teamId', team.value.id)
        .where('season', season => !filters.season || filters.season === season)
        .orderBy('name')
        .get()
        .map(comp => comp.name)
    )
  ])

  function ratingColor(rating) {
    switch (Math.round(rating)) {
      case 1:
        return 'red'
      case 2:
        return 'orange'
      case 3:
        return 'lime'
      case 4:
        return 'light-green'
      case 5:
        return 'green'
    }
  }
</script>

<template>
  <div class="text-h4 mb-2">Player Statistics</div>

  <v-btn :to="`/teams/${team.id}/players/development`">Development</v-btn>

  <div class="d-flex mt-2">
    <v-btn-toggle v-model="filter" variant="outlined">
      <v-btn
        v-for="option in filterOptions"
        :key="option.text"
        icon
        :color="option.color"
        :value="option.text"
      >
        <v-icon>mdi-{{ option.icon }}</v-icon>
        <v-tooltip
          activator="parent"
          :text="`${option.text} Players`"
          location="bottom"
        />
      </v-btn>
    </v-btn-toggle>
    <v-spacer />
    <div class="flex-grow-1">
      <v-select
        v-model="filters.season"
        label="Season"
        :items="seasonOptions"
        density="compact"
        clearable
        hide-details
      />
      <v-checkbox
        v-model="splitSeason"
        label="Split by Season"
        hide-details
        density="compact"
        class="d-inline-block"
      />
    </div>
    <v-spacer />
    <div class="flex-grow-1">
      <v-autocomplete
        v-model="filters.competition"
        label="Competition"
        :items="competitionNames"
        density="compact"
        clearable
        hide-details
      />
      <v-checkbox
        v-model="splitCompetition"
        label="Split by Competition"
        hide-details
        density="compact"
        class="d-inline-block"
      />
    </div>
  </div>

  <v-data-table-virtual
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="items"
    :custom-key-sort="{ 'player.pos': sortByPosition }"
    density="compact"
    height="50vh"
    class="rounded mt-4"
  >
    <template #[`column.player.nationality`]="{ column, getSortIcon }">
      <span>
        <v-icon>mdi-flag</v-icon>
      </span>
      <v-icon
        class="v-data-table-header__sort-icon"
        :icon="getSortIcon(column)"
      />
    </template>
    <template #[`item.player.name`]="{ item }">
      <v-btn
        :to="`/teams/${team.id}/players/${item.raw.player.id}`"
        :text="item.raw.player.name"
        size="small"
        variant="text"
        color="primary"
        class="text-capitalize"
      />
    </template>
    <template #[`item.player.nationality`]="{ item }">
      <flag
        :iso="item.raw.player.flag"
        :title="item.raw.player.nationality"
        class="mr-2"
      />
    </template>
    <template #[`item.season`]="{ item }">
      {{ seasonLabel(item.raw.season) }}
    </template>
    <template #[`item.avgRating`]="{ item }">
      <v-progress-linear
        :model-value="(item.raw.avgRating / 5) * 100"
        :color="ratingColor(item.raw.avgRating)"
        size="x-small"
        striped
        height="25"
      >
        <strong class="text-black">{{ item.raw.avgRating.toFixed(2) }}</strong>
      </v-progress-linear>
    </template>
    <template #[`item.xGAndxA`]="{ item }">
      {{ item.raw.xGAndxA?.toFixed(2) }}
    </template>
    <template #[`item.xG`]="{ item }">
      {{ item.raw.xG?.toFixed(2) }}
    </template>
    <template #[`item.xA`]="{ item }">
      {{ item.raw.xA?.toFixed(2) }}
    </template>
  </v-data-table-virtual>
</template>

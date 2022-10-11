<script setup>
  import { Player, Competition } from '~/models'

  const { data, team, currentSeason, seasonLabel } = await useTeamQuery({
    query: gql`
      query fetchPlayersPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players { ...PlayerData }
          playerPerformanceStats { ...PlayerPerformanceStatsData }
          competitions { ...CompetitionData }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${playerPerformanceStatsFragment}
      ${competitionFragment}
    `
  })

  const { playerPerformanceStats } = data.value.team
  const statsByPlayerId = groupBy(playerPerformanceStats, 'playerId')

  const filter = ref('Active')
  const filterOptions = [
    { text: 'All', color: 'blue', icon: 'earth' },
    { text: 'Youth', color: 'cyan', icon: 'school' },
    { text: 'Active', color: 'light-green', icon: 'account-check' },
  ]

  const metrics = [
    'numMatches',
    'numMinutes',
    'numGoals',
    'numAssists',
    'numCleanSheets'
  ]

  const headers = [
    { text: 'Name', value: 'name', width: 200, class: 'stick-left' },
    { text: 'Nationality', value: 'nationality', align: 'center', width: 120 },
    { text: 'Pos', value: 'pos', align: 'center', width: 100, sortBy: 'posIdx' },
    { text: 'Games Played', value: 'numMatches', align: 'end', class: 'text-right' },
    { text: 'Minutes', value: 'numMinutes', align: 'end', class: 'text-right' },
    { text: 'Goals', value: 'numGoals', align: 'end', class: 'text-right' },
    { text: 'Assists', value: 'numAssists', align: 'end', class: 'text-right' },
    { text: 'Clean Sheets', value: 'numCleanSheets', align: 'end', class: 'text-right' }
  ]

  const filters = reactive({
    season: null,
    competition: null
  })

  const playerRepo = useRepo(Player)
  const players = computed(() => playerRepo.where('teamId', team.value.id).get())
  const rows = computed(() => players.value.filter(player => {
    switch (filter.value) {
      case 'All':
        return true
      case 'Youth':
        return player.youth
      case 'Active':
        return player.status !== null && player.status !== 'Pending'
    }
  }).map(player => {
    const playerStats = []
    const matchStats = (statsByPlayerId[player.id] || []).reduce(
      (totalStats, data) => {
        if (
          [null, data.season].includes(filters.season) &&
          [null, data.competition].includes(filters.competition)
        ) {
          playerStats.push(data)
          metrics.forEach(metric => {
            totalStats[metric] += data[metric]
          })
        }
        return totalStats
      },
      {
        numMatches: 0,
        numMinutes: 0,
        numGoals: 0,
        numAssists: 0,
        numCleanSheets: 0
      }
    )

    return {
      ...player,
      ...matchStats,
      posIdx: player.posIdx,
      flag: player.flag,
      playerStats: playerStats.sort((a, b) => a.season - b.season)
    }
  }))

  const seasonOptions = [...Array(currentSeason.value + 1).keys()].map(season => ({
    title: seasonLabel(season),
    value: season
  }))

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
</script>

<template>
  <h1>Player Statistics</h1>

  <v-btn :to="`/teams/${team.id}/analytics/development`">
    Development
  </v-btn>

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
      :items="competitionNames"
      density="compact"
      clearable
      hide-details
    />
  </div>

  <data-table
    :headers="headers"
    :items="rows"
    item-key="id"
    sort-by="pos"
    class="mt-4"
  >
    <template #item="{ item }">
      <td class="stick-left">
        <v-btn
          :to="`/teams/${team.id}/players/${item.id}`"
          size="small"
          variant="text"
          color="primary"
          class="text-capitalize"
          v-text="item.name"
        />
      </td>
      <td class="text-center">
        <flag
          :iso="item.flag"
          :title="item.nationality"
          class="mr-2"
        />
      </td>
      <td class="text-center">{{ item.pos }}</td>
      <td class="text-right">{{ item.numMatches }}</td>
      <td class="text-right">{{ item.numMinutes }}</td>
      <td class="text-right">{{ item.numGoals }}</td>
      <td class="text-right">{{ item.numAssists }}</td>
      <td class="text-right">{{ item.numCleanSheets }}</td>
    </template>
  </data-table>
</template>

<script setup>
  import { Player } from '~/models'

  const { data, team, seasonLabel, currentSeason } = await useTeamQuery({
    query: gql`
      query fetchPlayersPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players { ...PlayerData }
          playerDevelopmentStats { ...PlayerDevelopmentStatsData }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${playerDevelopmentStatsFragment}
    `
  })

  const { playerDevelopmentStats } = data.value.team
  const statsByPlayerId = groupBy(playerDevelopmentStats, 'playerId')

  const filter = ref('Active')
  const filterOptions = [
    { text: 'All', color: 'blue', icon: 'earth' },
    { text: 'Youth', color: 'cyan', icon: 'school' },
    { text: 'Active', color: 'light-green', icon: 'account-check' },
  ]

  const metric = ref('OVR')
  const metrics = [
    { text: 'OVR', color: 'green', icon: 'trending-up' },
    { text: 'Value', color: 'red', icon: 'cash-multiple' }
  ]

  const headers = computed(() => {
    const columns = [
      { text: 'Name', value: 'name', width: 200, class: 'stick-left' },
      { text: 'Nationality', value: 'nationality', class: 'text-center', cellClass: 'text-center', width: 120 },
      { text: 'Pos', value: 'pos', class: 'text-center', cellClass: 'text-center', width: 100, sortBy: 'posIdx' },
      {
        text: `Start ${metric.value}`,
        value: `start${metric.value.toLowerCase()}`,
        class: 'text-right',
        cellClass: 'text-right',
        width: 120
      }
    ]

    for (let i = 0; i <= currentSeason.value; i++) {
      columns.push({
        text: seasonLabel(i),
        value: `${metric.value.toLowerCase()}Diff.${i}`,
        class: 'text-right',
        cellClass: 'text-right',
        width: 120
      })
    }

    columns.push({
      text: `Last ${metric.value}`,
      value: metric.value,
      class: 'text-right',
      cellClass: 'text-right',
      width: 120
    })

    return columns
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
    const playerWithStats = { ...player, posIdx: player.posIdx, flag: player.flag }

    const stats = statsByPlayerId[player.id]
    if (stats) {
      const ovrDiff = {}
      const valueDiff = {}
      stats.forEach(stat => {
        ovrDiff[stat.season] = stat.ovr[1] - stat.ovr[0]
        valueDiff[stat.season] = (stat.value[1] - stat.value[0]) / stat.value[0] * 100
      })
      playerWithStats.ovrDiff = ovrDiff
      playerWithStats.startovr = stats[0].ovr[0]
      playerWithStats.valueDiff = valueDiff
      playerWithStats.startValue = stats[0].value[0]
    }

    return playerWithStats
  }))

  function ovrColor (ovrDiff) {
    switch (true) {
      case ovrDiff > 6:
        return 'text-green-darken-2'
      case ovrDiff > 4:
        return 'text-green'
      case ovrDiff > 2:
        return 'text-light-green-darken-2'
      case ovrDiff > 0:
        return 'text-light-green'
      case ovrDiff < -2:
        return 'text-red'
      case ovrDiff < 0:
        return 'text-orange'
      default:
        return 'text-grey'
    }
  }

  function valueColor (valueDiff) {
    switch (true) {
      case valueDiff > 100:
        return 'text-green-darken-2'
      case valueDiff > 50:
        return 'text-green'
      case valueDiff > 25:
        return 'text-light-green-darken-2'
      case valueDiff > 0:
        return 'text-light-green'
      case valueDiff < -25:
        return 'text-red'
      case valueDiff < 0:
        return 'text-orange'
      default:
        return 'text-grey'
    }
  }
</script>

<template>
  <h1>Player Development</h1>

  <v-btn :to="`/teams/${team.id}/analytics/statistics`">
    Statistics
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

    <v-btn-toggle v-model="metric" variant="outlined">
      <v-btn
        v-for="option in metrics"
        :key="option.text"
        icon
        :color="option.color"
        :value="option.text"
      >
        <v-icon>mdi-{{ option.icon }}</v-icon>
        <v-tooltip
          activator="parent"
          :text="option.text"
          location="bottom"
        />
      </v-btn>
    </v-btn-toggle>
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
      <template v-if="metric === 'OVR'">
      <td class="text-right">{{ item.startovr }}</td>
        <td
          v-for="(_, season) in new Array(currentSeason + 1)"
          :key="season"
          :class="`text-right ${ovrColor(item.ovrDiff[season])}`"
        >
          {{ item.ovrDiff[season] > 0 ? '+' : '' }}
          {{ item.ovrDiff[season] }}
        </td>
        <td class="text-right">{{ item.ovr }}</td>
      </template>
      <template v-else>
        <td class="text-right">
          {{ formatMoney(item.startValue, team.currency) }}
        </td>
        <td
          v-for="(_, season) in new Array(currentSeason + 1)"
          :key="season"
          :class="`text-right ${valueColor(item.valueDiff[season])}`"
        >
          <span v-if="item.valueDiff[season] !== undefined">
            {{ item.valueDiff[season] > 0 ? '+' : '' }}
            {{ item.valueDiff[season].toFixed(2) }}%
          </span>
        </td>
        <td class="text-right">
          {{ formatMoney(item.value, team.currency) }}
        </td>
      </template>
    </template>
  </data-table>
</template>

<script setup lang="ts">
  import { Player } from '~/models'

  interface PlayerStats {
    playerId: string
    season: number
    ovr: number[]
    value: number[]
  }

  const { data, team, seasonLabel, currentSeason } = await useTeamQuery<{
    team: {
      playerDevelopmentStats: PlayerStats[]
    }
  }>({
    query: gql`
      query fetchPlayersPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players {
            ...PlayerData
          }
          playerDevelopmentStats {
            ...PlayerDevelopmentStatsData
          }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${playerDevelopmentStatsFragment}
    `
  })

  const { playerDevelopmentStats } = data.value?.team || {}
  const statsByPlayerId: Record<string, PlayerStats[]> = _groupBy(
    playerDevelopmentStats,
    'playerId'
  )

  const filter = ref('Active')
  const filterOptions = [
    { text: 'All', color: 'blue', icon: 'earth' },
    { text: 'Youth', color: 'cyan', icon: 'school' },
    { text: 'Active', color: 'light-green', icon: 'account-check' }
  ]

  const metric = ref('OVR')
  const metrics = [
    { text: 'OVR', color: 'green', icon: 'trending-up' },
    { text: 'Value', color: 'red', icon: 'cash-multiple' }
  ]

  const headers: Ref<TableHeader[]> = computed(() => {
    const lMetric = metric.value.toLowerCase()
    const columns = [
      { title: 'Name', key: 'player.name', width: 200, fixed: true },
      {
        title: 'Nationality',
        key: 'player.nationality',
        align: 'center',
        width: 80
      },
      { title: 'Pos', key: 'player.pos', align: 'center' },
      {
        title: `Start ${metric.value}`,
        key: `start${capitalize(lMetric)}`,
        align: 'end',
        width: 150
      },
      {
        title: `Last ${metric.value}`,
        key: `player.${lMetric}`,
        align: 'end',
        width: 150
      },
      {
        title: `${metric.value} Change`,
        key: `${lMetric}Diff.total`,
        align: 'end',
        width: 150
      }
    ]

    for (let i = 0; i <= currentSeason.value; i++) {
      columns.push({
        title: seasonLabel(i),
        key: `${lMetric}Diff.${i}`,
        align: 'end',
        width: 150
      })
    }

    return columns
  })

  const sortBy: Ref<TableSortItem[]> = ref([
    { key: 'player.pos', order: 'asc' }
  ])

  interface StatDiff {
    total?: number
    [key: number]: number
  }

  interface PlayerWithStats {
    player: Player
    startOvr: number
    ovrDiff: StatDiff
    startValue: number
    valueDiff: StatDiff
  }

  const playerRepo = useRepo(Player)
  const players = computed(() =>
    playerRepo.where('teamId', team.value.id).get()
  )
  const rows = computed(() =>
    players.value
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
      .map(player => {
        const playerWithStats: PlayerWithStats = {
          player,
          ovrDiff: {},
          startOvr: 0,
          valueDiff: {},
          startValue: 0
        }

        const stats = statsByPlayerId[player.id]
        if (stats) {
          const ovrDiff: StatDiff = {}
          const valueDiff: StatDiff = {}
          stats.forEach(stat => {
            ovrDiff[stat.season] = stat.ovr[1] - stat.ovr[0]
            valueDiff[stat.season] =
              ((stat.value[1] - stat.value[0]) / stat.value[0]) * 100
          })
          playerWithStats.ovrDiff = ovrDiff
          playerWithStats.startOvr = stats[0].ovr[0]
          ovrDiff.total = playerWithStats.player.ovr - playerWithStats.startOvr
          playerWithStats.valueDiff = valueDiff
          playerWithStats.startValue = stats[0].value[0]
          valueDiff.total =
            playerWithStats.player.value - playerWithStats.startValue
        }

        return playerWithStats
      })
  )

  function ovrColor(ovrDiff: number) {
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

  function valueColor(valueDiff: number) {
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
  <div class="text-h4 mb-2">Player Development</div>

  <v-btn :to="`/teams/${team.id}/players/statistics`">Statistics</v-btn>

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
        <v-tooltip activator="parent" :text="option.text" location="bottom" />
      </v-btn>
    </v-btn-toggle>
  </div>

  <v-data-table-virtual
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="rows"
    :custom-key-sort="{ 'player.pos': sortByPosition }"
    density="compact"
    height="50vh"
    class="rounded mt-4"
  >
    <template #[`header.player.nationality`]="{ column, getSortIcon }">
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
        :to="`/teams/${team.id}/players/${item.player.id}`"
        :text="item.player.name"
        size="small"
        variant="text"
        color="primary"
        class="text-capitalize"
      />
    </template>
    <template #[`item.player.nationality`]="{ item }">
      <flag
        :iso="item.player.flag"
        :title="item.player.nationality"
        class="mr-2"
      />
    </template>
    <template #[`item.ovrDiff.total`]="{ item }">
      <div :class="ovrColor(item.ovrDiff.total)">
        {{ item.ovrDiff.total }}
      </div>
    </template>
    <template
      v-for="(_, season) in new Array(currentSeason + 1)"
      :key="season"
      #[`item.ovrDiff.${season}`]="{ item }"
    >
      <div :class="ovrColor(item.ovrDiff[season])">
        {{ item.ovrDiff[season] > 0 ? '+' : '' }}
        {{ item.ovrDiff[season] }}
      </div>
    </template>
    <template #[`item.startValue`]="{ item }">
      {{ formatMoney(item.startValue, team.currency) }}
    </template>
    <template #[`item.player.value`]="{ item }">
      {{ formatMoney(item.player.value, team.currency) }}
    </template>
    <template #[`item.valueDiff.total`]="{ item }">
      <div :class="{ 'text-end': true, 'text-red': item.valueDiff.total < 0 }">
        {{ formatMoney(item.valueDiff.total, team.currency, '-') }}
      </div>
    </template>
    <template
      v-for="(_, season) in new Array(currentSeason + 1)"
      :key="season"
      #[`item.valueDiff.${season}`]="{ item }"
    >
      <div
        v-if="item.valueDiff[season] !== undefined"
        :class="valueColor(item.valueDiff[season])"
      >
        {{ item.valueDiff[season] > 0 ? '+' : '' }}
        {{ item.valueDiff[season].toFixed(2) }}%
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script setup lang="ts">
  import { Player } from '~/models'

  defineProps<{ teamId: string }>()

  const { data, team, seasonLabel, currentSeason } = await useTeamQuery({
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

  const { playerDevelopmentStats } = data.value.team
  const statsByPlayerId = _groupBy(playerDevelopmentStats, 'playerId')

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

  const headers = computed(() => {
    const lMetric = metric.value.toLowerCase()
    const columns = [
      { text: 'Name', value: 'player.name', width: 200, class: 'sticky' },
      { text: 'Nationality', value: 'player.nationality', align: 'center' },
      { text: 'Pos', value: 'player.pos', align: 'center', sortBy: 'posIdx' },
      {
        text: `Start ${metric.value}`,
        value: `start${capitalize(lMetric)}`,
        align: 'end'
      },
      {
        text: `Last ${metric.value}`,
        value: `player.${lMetric}`,
        align: 'end'
      },
      {
        text: `${metric.value} Change`,
        value: `${lMetric}Diff.total`,
        align: 'end'
      }
    ]

    for (let i = 0; i <= currentSeason.value; i++) {
      columns.push({
        text: seasonLabel(i),
        value: `${lMetric}Diff.${i}`,
        align: 'end'
      })
    }

    return columns
  })

  interface StatDiff {
    total?: number
    [key: string]: number
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

  <data-table
    :headers="headers"
    :items="rows"
    item-key="id"
    sort-by="pos"
    :items-per-page="-1"
    density="compact"
    class="mt-4"
  >
    <template #[`header-player.nationality`]>
      <v-icon>mdi-flag</v-icon>
    </template>
    <template #item="{ item, rowColor }">
      <td class="sticky">
        <v-sheet :class="`mx-n4 px-4 ${rowColor}`">
          <v-btn
            :to="`/teams/${team.id}/players/${item.player.id}`"
            :text="item.player.name"
            size="small"
            variant="text"
            color="primary"
            class="text-capitalize"
          />
        </v-sheet>
      </td>
      <td class="text-center">
        <flag
          :iso="item.player.flag"
          :title="item.player.nationality"
          class="mr-2"
        />
      </td>
      <td class="text-center">{{ item.player.pos }}</td>
      <template v-if="metric === 'OVR'">
        <td class="text-right">{{ item.startOvr }}</td>
        <td class="text-right">{{ item.player.ovr }}</td>
        <td :class="`text-right ${ovrColor(item.ovrDiff.total)}`">
          {{ item.ovrDiff.total }}
        </td>
        <td
          v-for="(_, season) in new Array(currentSeason + 1)"
          :key="season"
          :class="`text-right ${ovrColor(item.ovrDiff[season])}`"
        >
          {{ item.ovrDiff[season] > 0 ? '+' : '' }}
          {{ item.ovrDiff[season] }}
        </td>
      </template>
      <template v-else>
        <td class="text-right">
          {{ formatMoney(item.startValue, team.currency) }}
        </td>
        <td class="text-right">
          {{ formatMoney(item.player.value, team.currency) }}
        </td>
        <td
          :class="{ 'text-right': true, 'text-red': item.valueDiff.total < 0 }"
        >
          {{ formatMoney(item.valueDiff.total, team.currency, '-') }}
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
      </template>
    </template>
  </data-table>
</template>

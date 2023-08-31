<script setup lang="ts">
  import { Player } from '~/models'

  useHead({
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/apexcharts' },
      { src: 'https://d3js.org/d3.v7.min.js' },
      { src: 'https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js' }
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/cal-heatmap/dist/cal-heatmap.css'
      }
    ]
  })

  interface PlayerStats {
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

  const route = useRoute<'/teams/[teamId]/players/[playerId]/'>()
  const { data, team } = await useTeamQuery<{
    team: {
      playerPerformanceStats: PlayerStats[]
    }
    player: object
  }>({
    query: gql`
      query fetchPlayerPage($teamId: ID!, $playerId: ID!) {
        player(id: $playerId) {
          ...PlayerData
          coverage {
            ${Object.keys(matchPositions).join(' ')}
          }
          contracts {
            ...ContractData
          }
          transfers {
            ...TransferData
          }
          loans {
            ...LoanData
          }
          injuries {
            ...InjuryData
          }
          histories {
            ...PlayerHistoryData
          }
        }
        team(id: $teamId) {
          ...TeamData
          playerPerformanceStats(playerIds: [$playerId]) {
            ...PlayerPerformanceStatsData
          }
        }
      }
      ${playerFragment}
      ${contractFragment}
      ${transferFragment}
      ${loanFragment}
      ${injuryFragment}
      ${playerHistoryFragment}
      ${teamFragment}
      ${playerPerformanceStatsFragment}
    `,
    variables: {
      teamId: route.params.teamId,
      playerId: route.params.playerId
    }
  })
  const playerRepo = useRepo(Player)
  if (data.value) {
    playerRepo.save(data.value.player)
  }
  const player = computed(
    () => playerRepo.withAll().find(parseInt(route.params.playerId)) as Player
  )

  const playerPerformanceStats = data.value?.team?.playerPerformanceStats || []
  const playerStats = {
    numMatches: 0,
    numCleanSheets: 0,
    numGoals: 0,
    numAssists: 0,
    numMinutes: 0,
    avgRating: 0
  }
  playerPerformanceStats.forEach((stats: PlayerStats) => {
    for (const stat in playerStats) {
      if (stat === 'avgRating') {
        playerStats.avgRating += stats.avgRating * stats.numMinutes
      } else {
        playerStats[stat as keyof typeof playerStats] +=
          stats[stat as keyof PlayerStats]
      }
    }
  })
  playerStats.avgRating /= playerStats.numMinutes || 1

  const ratingColor = computed(() => {
    switch (Math.round(playerStats.avgRating)) {
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
  })

  const router = useRouter()
</script>

<template>
  <div class="text-h4">{{ player.name }}</div>

  <div class="my-2">
    <v-btn :to="`/teams/${team.id}/players/${player.id}/edit`">Edit</v-btn>
    &nbsp;
    <remove-button
      :record="player"
      store="Player"
      :label="player.name"
      @removed="router.push(`/teams/${team.id}/players`)"
    />
  </div>

  <v-row class="text-center mt-2" justify="space-around">
    <v-col cols="12" sm="8" class="d-flex flex-column">
      <v-row justify="space-around">
        <v-col cols="4">
          <div class="text-h4">{{ player.age }}</div>
          <div class="subheading">Age</div>
        </v-col>
        <v-col v-if="player.nationality" cols="4">
          <flag
            v-if="player.flag"
            :iso="player.flag"
            :title="player.nationality"
            size="xl"
          />
          <div v-else class="text-h4">{{ player.nationality }}</div>
          <div class="subheading">Nationality</div>
        </v-col>
        <v-col cols="4">
          <v-icon
            class="text-h4"
            :color="player.statusColor"
            :icon="`mdi-${player.statusIcon}`"
          />
          <div class="subheading">{{ player.status || 'Status' }}</div>
        </v-col>
      </v-row>
      <v-row justify="space-around" class="mt-2">
        <v-col cols="6" sm="4">
          <player-attribute
            :player="player"
            attribute="kitNo"
            label="Kit No"
            class="text-h4"
          />
          <div class="subheading">Kit No</div>
        </v-col>
        <v-col cols="6" sm="4">
          <player-attribute
            :player="player"
            attribute="ovr"
            label="OVR"
            class="text-h4"
          />
          <div class="subheading">OVR</div>
        </v-col>
        <v-col cols="12" md="4">
          <player-attribute
            :player="player"
            attribute="value"
            label="Value"
            class="text-h4"
          >
            <template #display>
              {{ formatMoney(player.value, team.currency) }}
            </template>
            <template #form="{ modelValue, updateModelValue, closeMenu }">
              <money-field
                label="Value"
                hide-details
                variant="solo"
                density="compact"
                clearable
                autofocus
                :style="{ width: '10em' }"
                :model-value="modelValue"
                @update:model-value="updateModelValue"
                @keydown.enter="closeMenu"
              />
            </template>
          </player-attribute>
          <div class="subheading">Value</div>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" sm="4">
      <v-row dense justify="space-around">
        <v-col cols="6">
          <div class="text-h4">{{ player.pos }}</div>
          <div class="subheading">Position</div>
        </v-col>
        <v-col v-if="player.secPos.length > 0" cols="6">
          <div class="text-h4">{{ player.secPos?.join(', ') || 'N/A' }}</div>
          <div class="subheading">Secondary Position(s)</div>
        </v-col>
        <v-col cols="12" class="d-flex justify-center mt-2">
          <div class="w-100" :style="{ maxWidth: '300px' }">
            <player-coverage-legend class="justify-center" />
            <player-coverage :player="player" />
            <div class="subheading mt-1">Coverage</div>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <section id="performance">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start>mdi-run</v-icon>
      Performance
    </div>

    <v-row class="text-center" justify="space-around">
      <v-col cols="6" sm="2">
        <div class="text-h4">{{ playerStats.numMatches || 0 }}</div>
        <div class="subheading">Matches</div>
      </v-col>
      <v-col cols="6" sm="2">
        <div class="text-h4">{{ playerStats.numCleanSheets || 0 }}</div>
        <div class="subheading">Clean Sheets</div>
      </v-col>
      <v-col cols="6" sm="2">
        <div class="text-h4">{{ playerStats.numGoals || 0 }}</div>
        <div class="subheading">Goals</div>
      </v-col>
      <v-col cols="6" sm="2">
        <div class="text-h4">{{ playerStats.numAssists || 0 }}</div>
        <div class="subheading">Assists</div>
      </v-col>
      <v-col cols="12" sm="3">
        <div class="text-h4">
          <v-rating
            readonly
            :model-value="playerStats.avgRating"
            half-increments
            :color="ratingColor"
          />
        </div>
        <div class="subheading">Rating</div>
      </v-col>
      <v-col cols="12">
        <player-rating-heatmap :player="player" />
      </v-col>
    </v-row>
  </section>

  <section id="timeline">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start>mdi-timeline</v-icon>
      Timeline
    </div>

    <player-timeline :player="player" />
  </section>

  <section id="development">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start>mdi-chart-line</v-icon>
      Development
    </div>

    <v-row class="text-center justify-center">
      <v-col cols="12" md="10" lg="8">
        <player-development-chart :player="player" />
      </v-col>
    </v-row>
  </section>
</template>

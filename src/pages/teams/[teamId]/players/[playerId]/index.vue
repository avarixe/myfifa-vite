<script setup>
  import { Player } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true },
    playerId: { type: String, required: true }
  })

  const { data, team } = await useTeamQuery({
    query: gql`
      query fetchPlayerPage($teamId: ID!, $playerId: ID!) {
        player(id: $playerId) {
          ...PlayerData
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
      teamId: props.teamId,
      playerId: props.playerId
    }
  })
  const playerRepo = useRepo(Player)
  playerRepo.save(data.value?.player)
  const player = computed(() =>
    playerRepo.withAll().find(parseInt(props.playerId))
  )

  const {
    team: { playerPerformanceStats }
  } = data.value
  const playerStats = {
    numMatches: 0,
    numCleanSheets: 0,
    numGoals: 0,
    numAssists: 0,
    numMinutes: 0,
    avgRating: 0
  }
  playerPerformanceStats.forEach(stats => {
    for (const stat in playerStats) {
      if (stat === 'avgRating') {
        playerStats.avgRating += stats.avgRating * stats.numMinutes
      } else {
        playerStats[stat] += stats[stat]
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
  <h1>{{ player.name }}</h1>

  <div>
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
    <v-col cols="6" sm="2">
      <div class="text-h4">{{ player.pos }}</div>
      <div class="subheading">Position</div>
    </v-col>
    <v-col v-if="player.secPos.length > 0" cols="6" sm="2">
      <div class="text-h4">{{ player.secPos?.join(', ') || 'N/A' }}</div>
      <div class="subheading">Secondary Position(s)</div>
    </v-col>
    <v-col cols="4" sm="2">
      <div class="text-h4">{{ player.age }}</div>
      <div class="subheading">Age</div>
    </v-col>
    <v-col v-if="player.nationality" cols="4" sm="2">
      <flag
        v-if="player.flag"
        :iso="player.flag"
        :title="player.nationality"
        size="xl"
      />
      <div v-else class="text-h4">{{ player.nationality }}</div>
      <div class="subheading">Nationality</div>
    </v-col>
    <v-col cols="4" sm="2">
      <v-icon
        class="text-h4"
        :color="player.statusColor"
        :icon="`mdi-${player.statusIcon}`"
      />
      <div class="subheading">{{ player.status || 'Status' }}</div>
    </v-col>
  </v-row>
  <v-row class="text-center mt-2" justify="space-around">
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
    <v-col cols="12" sm="4">
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

  <section id="performance">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-run</v-icon>
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
    </v-row>
  </section>

  <section id="timeline">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-timeline</v-icon>
      Timeline
    </div>

    <player-timeline :player="player" />
  </section>

  <section id="development">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-chart-line</v-icon>
      Development
    </div>

    <v-row class="text-center justify-center">
      <v-col cols="12" md="10" lg="8">
        <player-development-chart :player="player" />
      </v-col>
    </v-row>
  </section>
</template>

<script setup lang="ts">
  interface CompetitionStats {
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
  }

  const props = defineProps<{
    competitionStats: CompetitionStats[]
    teamDevelopmentStats: {
      startOvr: number
      endOvr: number
      startValue: string
      endValue: string
    }
  }>()

  const { team } = useTeam()

  function statTotal(key: keyof CompetitionStats) {
    return props.competitionStats.reduce(
      (total, stats) => total + stats[key],
      0
    )
  }
</script>

<template>
  <v-container>
    <v-row class="text-center" justify="space-around" dense>
      <v-col cols="12" sm="6">
        <div class="text-h4">
          <season-stat-change
            :start-value="teamDevelopmentStats.startOvr"
            :end-value="teamDevelopmentStats.endOvr"
          />
        </div>
        <div class="subheading">Team OVR</div>
      </v-col>
      <v-col cols="12" sm="6">
        <div class="text-h4">
          <season-stat-change
            :formatter="(x: number) => formatMoney(x, team.currency)"
            :start-value="parseInt(teamDevelopmentStats.startValue)"
            :end-value="parseInt(teamDevelopmentStats.endValue)"
          />
        </div>
        <div class="subheading">Team Value</div>
      </v-col>
      <v-col cols="4" sm="2">
        <div class="text-h4">{{ statTotal('wins') }}</div>
        <div class="subheading">Wins</div>
      </v-col>
      <v-col cols="4" sm="2">
        <div class="text-h4">{{ statTotal('draws') }}</div>
        <div class="subheading">Draws</div>
      </v-col>
      <v-col cols="4" sm="2">
        <div class="text-h4">{{ statTotal('losses') }}</div>
        <div class="subheading">Losses</div>
      </v-col>
      <v-col cols="6" sm="2">
        <div class="text-h4">{{ statTotal('goalsFor') }}</div>
        <div class="subheading">Goals For</div>
      </v-col>
      <v-col cols="6" sm="2">
        <div class="text-h4">{{ statTotal('goalsAgainst') }}</div>
        <div class="subheading">Goals Against</div>
      </v-col>
    </v-row>
  </v-container>
</template>

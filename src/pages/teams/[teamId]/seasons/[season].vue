<script setup lang="ts">
  const props = defineProps<{ teamId: string; season: string }>()
  const season = computed(() => parseInt(props.season))

  const competitionStats = ref([])
  const playerDevelopmentStats = ref([])
  const teamDevelopmentStats = ref([])
  const transferActivity = ref([])
  const { team, seasonLabel, currentSeason, ready } = useTeamQuery({
    query: gql`
      query fetchSeason($teamId: ID!, $season: Int!) {
        team(id: $teamId) {
          ...TeamData
          competitions {
            ...CompetitionData
          }
          players {
            ...PlayerData
          }
          competitionStats(season: $season) {
            ...CompetitionStatsData
          }
          teamDevelopmentStats(season: $season) {
            ...TeamDevelopmentStatsData
          }
          playerDevelopmentStats(season: $season) {
            ...PlayerDevelopmentStatsData
          }
          transferActivity(season: $season) {
            arrivals {
              ...ContractData
            }
            departures {
              ...ContractData
            }
            transfers {
              ...TransferData
            }
            loans {
              ...LoanData
            }
          }
        }
      }
      ${teamFragment}
      ${competitionFragment}
      ${playerFragment}
      ${competitionStatsFragment}
      ${playerDevelopmentStatsFragment}
      ${teamDevelopmentStatsFragment}
      ${contractFragment}
      ${transferFragment}
      ${loanFragment}
    `,
    variables: () => ({
      teamId: parseInt(props.teamId),
      season
    }),
    onQuery(data) {
      competitionStats.value = data.team.competitionStats
      playerDevelopmentStats.value = data.team.playerDevelopmentStats
      teamDevelopmentStats.value = data.team.teamDevelopmentStats
      transferActivity.value = data.team.transferActivity
    }
  })

  const playerValues = computed(() =>
    playerDevelopmentStats.value.reduce(
      (obj, stats) => ({ ...obj, [stats.playerId]: stats.value }),
      {}
    )
  )
</script>

<template>
  <template v-if="ready">
    <div class="text-h4">{{ seasonLabel(season) }} Season</div>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-btn
          :to="`/teams/${team.id}/seasons/${season - 1}`"
          text="Previous Season"
          :disabled="season === 0"
        />
        &nbsp;
        <v-btn
          :to="`/teams/${team.id}/seasons/${season + 1}`"
          text="Next Season"
          :disabled="season >= currentSeason"
        />
      </v-col>
    </v-row>

    <section id="summary">
      <div class="text-h4 my-3 text-info font-weight-light">
        <v-icon start>mdi-calendar</v-icon>
        Summary
      </div>

      <season-summary
        :competition-stats="competitionStats"
        :team-development-stats="teamDevelopmentStats"
      />
    </section>

    <section id="competitions">
      <div class="text-h4 my-3 text-info font-weight-light">
        <v-icon start>mdi-trophy</v-icon>
        Competitions
      </div>

      <season-competition-table
        :season="season"
        :competition-stats="competitionStats"
      />
    </section>

    <section id="transfers">
      <div class="text-h4 my-3 text-info font-weight-light">
        <v-icon start>mdi-airplane-takeoff</v-icon>
        Transfers
      </div>

      <season-transfer-table
        :season="season"
        :transfer-activity="transferActivity"
        :player-values="playerValues"
      />
    </section>
  </template>
</template>

<script setup>
  const route = useRoute()
  const season = computed(() => parseInt(route.params.season))
  const { data, team, seasonLabel, currentSeason } = await useTeamQuery({
    query: gql`
      query fetchSeason($teamId: ID!, $season: Int!) {
        team(id: $teamId) {
          ...TeamData
          competitions { ...CompetitionData }
          players { ...PlayerData }
          competitionStats(season: $season) { ...CompetitionStatsData }
          teamDevelopmentStats(season: $season) { ...TeamDevelopmentStatsData }
          playerDevelopmentStats(season: $season) { ...PlayerDevelopmentStatsData }
          transferActivity(season: $season) {
            arrivals { ...ContractData }
            departures { ...ContractData }
            transfers { ...TransferData }
            loans { ...LoanData }
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
    variables: {
      teamId: parseInt(route.params.teamId),
      season
    }
  })

  const playerValues = computed(() =>
    data.value.team.playerDevelopmentStats.reduce(
      (obj, stats) => ({ ...obj, [stats.playerId]: stats.value }),
      {}
    )
  )
</script>

<template>
  <h1>{{ seasonLabel(season) }} Season</h1>

  <v-row>
    <v-col cols="12">
      <v-btn :to="`/teams/${team.id}/seasons/${season - 1}`" :disabled="season === 0">
        Previous Season
      </v-btn>
      &nbsp;
      <v-btn :to="`/teams/${team.id}/seasons/${season + 1}`" :disabled="season >= currentSeason">
        Next Season
      </v-btn>
    </v-col>
  </v-row>

  <section id="summary">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-calendar</v-icon>
      Summary
    </div>

    <season-summary
      :competition-stats="data.team.competitionStats"
      :team-development-stats="data.team.teamDevelopmentStats"
    />
  </section>

  <section id="competitions">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-trophy</v-icon>
      Competitions
    </div>

    <season-competition-table
      :season="season"
      :competition-stats="data.team.competitionStats"
    />
  </section>

  <section id="transfers">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-airplane-takeoff</v-icon>
      Transfers
    </div>

    <season-transfer-table
      :season="season"
      :transfer-activity="data.team.transferActivity"
      :player-values="playerValues"
    />
  </section>
</template>

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

  const {
    competitionStats,
    teamDevelopmentStats,
    transferActivity
  } = data.value.team
</script>

<template>
  <h1>{{ seasonLabel(season) }} Season</h1>

  <v-row>
    <v-col cols="12">
      <v-btn
        :to="`/teams/${team.id}/seasons/${season - 1}`"
        :disabled="season === 0"
        v-text="'Previous Season'"
      />
      &nbsp;
      <v-btn
        :to="`/teams/${team.id}/seasons/${season + 1}`"
        :disabled="season >= currentSeason"
        v-text="'Next Season'"
      />
    </v-col>
  </v-row>

  <section id="summary">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-calendar</v-icon>
      Summary
    </div>

    <season-summary
      :competition-stats="competitionStats"
      :team-development-stats="teamDevelopmentStats"
    />
  </section>

  <section id="competitions">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-trophy</v-icon>
      Competitions
    </div>

    <season-competition-table
      :season="season"
      :competition-stats="competitionStats"
    />
  </section>

  <section id="transfers">
    <div class="text-h4 my-3 text-info font-weight-light">
      <v-icon start large>mdi-airplane-takeoff</v-icon>
      Transfers
    </div>

    <season-transfer-table
      :season="season"
      :transfer-activity="transferActivity"
    />
  </section>
</template>

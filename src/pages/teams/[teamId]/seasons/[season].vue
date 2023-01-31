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
  <h3 class="text-h3">{{ seasonLabel(season) }} Season</h3>

  <div class="row">
    <div class="col">
      <q-btn
        :to="`/teams/${team.id}/seasons/${season - 1}`"
        :disable="season === 0"
        label="Previous Season"
      />
      &nbsp;
      <q-btn
        :to="`/teams/${team.id}/seasons/${season + 1}`"
        :disable="season >= currentSeason"
        label="Next Season"
      />
    </div>
  </div>

  <section id="summary">
    <div class="text-h4 my-3 text-info font-weight-light">
      <q-icon name="mdi-calendar" />
      Summary
    </div>

    <season-summary
      :competition-stats="data.team.competitionStats"
      :team-development-stats="data.team.teamDevelopmentStats"
    />
  </section>

  <section id="competitions">
    <div class="text-h4 my-3 text-info font-weight-light">
      <q-icon name="mdi-trophy" />
      Competitions
    </div>

    <season-competition-table
      :season="season"
      :competition-stats="data.team.competitionStats"
    />
  </section>

  <section id="transfers">
    <div class="text-h4 my-3 text-info font-weight-light">
      <q-icon name="mdi-airplane-takeoff" />
      Transfers
    </div>

    <season-transfer-table
      :season="season"
      :transfer-activity="data.team.transferActivity"
      :player-values="playerValues"
    />
  </section>
</template>

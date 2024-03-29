<script setup lang="ts">
  import { Contract, Loan, Transfer } from '~/models'

  const route = useRoute<'/teams/[teamId]/seasons/[season]'>()
  const season = computed(() => Number(route.params.season))
  const { data, team, seasonLabel, currentSeason } = await useTeamQuery<{
    team: {
      competitionStats: {
        name: string
        competition: string
        wins: number
        draws: number
        losses: number
        goalsFor: number
        goalsAgainst: number
      }[]
      playerDevelopmentStats: { playerId: string; value: number[] }[]
      teamDevelopmentStats: {
        startOvr: number
        endOvr: number
        startValue: string
        endValue: string
      }
      transferActivity: {
        arrivals: Contract[]
        departures: Contract[]
        transfers: Transfer[]
        loans: Loan[]
      }
    }
  }>({
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
    variables: {
      teamId: route.params.teamId,
      season
    }
  })

  const playerValues = computed(
    () =>
      data.value?.team?.playerDevelopmentStats?.reduce(
        (
          obj: Record<string, number[]>,
          stats: { playerId: string; value: number[] }
        ) => ({ ...obj, [stats.playerId]: stats.value }),
        {}
      ) || {}
  )
</script>

<template>
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

  <template v-if="data">
    <section id="summary">
      <div class="text-h4 my-3 text-info font-weight-light">
        <v-icon start>mdi-calendar</v-icon>
        Summary
      </div>

      <season-summary
        :competition-stats="data.team.competitionStats"
        :team-development-stats="data.team.teamDevelopmentStats"
      />
    </section>

    <section id="competitions">
      <div class="text-h4 my-3 text-info font-weight-light">
        <v-icon start>mdi-trophy</v-icon>
        Competitions
      </div>

      <season-competition-table
        :season="season"
        :competition-stats="data.team.competitionStats"
      />
    </section>

    <section id="transfers">
      <div class="text-h4 my-3 text-info font-weight-light">
        <v-icon start>mdi-airplane-takeoff</v-icon>
        Transfers
      </div>

      <season-transfer-table
        :season="season"
        :transfer-activity="data.team.transferActivity"
        :player-values="playerValues"
      />
    </section>
  </template>
</template>

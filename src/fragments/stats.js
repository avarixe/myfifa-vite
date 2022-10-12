import { gql } from '@urql/core'

export const competitionStatsFragment = gql`
  fragment CompetitionStatsData on CompetitionStats {
    season
    competition
    wins
    draws
    losses
    goalsFor
    goalsAgainst
  }
`

export const playerPerformanceStatsFragment = gql`
  fragment PlayerPerformanceStatsData on PlayerPerformanceStats {
    playerId
    season
    competition
    numMatches
    numMinutes
    numGoals
    numAssists
    numCleanSheets
    avgRating
  }
`

export const playerDevelopmentStatsFragment = gql`
  fragment PlayerDevelopmentStatsData on PlayerDevelopmentStats {
    season
    playerId
    ovr
    value
  }
`

export const teamDevelopmentStatsFragment = gql`
  fragment TeamDevelopmentStatsData on TeamDevelopmentStats {
    season
    startOvr
    startValue
    endOvr
    endValue
  }
`

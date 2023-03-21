export default competitionId => {
  const competitionRepo = useRepo(Competition)
  const competition = computed(() =>
    competitionRepo
      .with('team')
      .with('stages', query => {
        query.with('tableRows')
      })
      .find(competitionId)
  )

  const tableRowRepo = useRepo(TableRow)
  const allGroupTeams = computed(() =>
    tableRowRepo
      .whereHas('stage', query => {
        query.where('competitionId', competitionId).where('table', true)
      })
      .orderBy('name')
      .get()
      .map(row => row.name)
  )

  const fixtureRepo = useRepo(Fixture)
  function stageFixtureTeams(stage) {
    const names = fixtureRepo
      .with('legs')
      .where('stageId', stage.id)
      .get()
      .map(fixture => {
        const scoreDiff = fixtureScoreDiff(fixture)
        if (scoreDiff > 0) {
          return [fixture.homeTeam]
        } else if (scoreDiff < 0) {
          return [fixture.awayTeam]
        } else {
          return [fixture.homeTeam, fixture.awayTeam]
        }
      })
    return [...new Set(names.flat())].sort()
  }

  function fixtureScoreDiff(fixture) {
    let homeScore = 0
    let awayScore = 0

    const scoreRegex = /^(\d+)(?: \((\d+)\))?$/
    fixture.legs.forEach(leg => {
      if (!leg.homeScore || !leg.awayScore) {
        return
      }

      const [, homeLegScore, homePenScore] = scoreRegex.exec(leg.homeScore)
      const [, awayLegScore, awayPenScore] = scoreRegex.exec(leg.awayScore)

      if (homePenScore && awayPenScore) {
        homeScore = parseInt(homePenScore)
        awayScore = parseInt(awayPenScore)
      } else {
        homeScore += parseInt(homeLegScore)
        awayScore += parseInt(awayLegScore)
      }
    })

    return homeScore - awayScore
  }

  const stageRepo = useRepo(Stage)
  const orderedRounds = computed(() =>
    stageRepo
      .with('fixtures', query => {
        query.with('legs')
      })
      .where('competitionId', competitionId)
      .where('table', false)
      .orderBy('numFixtures', 'desc')
      .get()
  )

  function previousRoundTeams(stage) {
    const stageIndex = orderedRounds.value.findIndex(
      round => round.id === stage.id
    )
    if (stageIndex > 0) {
      return stageFixtureTeams(orderedRounds.value[stageIndex - 1])
    } else {
      return allGroupTeams.value
    }
  }

  const championOptions = computed(() => {
    if (competitionId) {
      const finalRound = orderedRounds.value.at(-1)

      if (finalRound) {
        return stageFixtureTeams(finalRound)
      } else {
        return allGroupTeams.value
      }
    } else {
      return []
    }
  })

  function teamColor(name) {
    if (name === competition.value.team.name) {
      return 'text-info'
    } else if (name && name === competition.value.champion) {
      return 'text-warning'
    } else {
      return ''
    }
  }

  return {
    competition,
    orderedRounds,
    previousRoundTeams,
    championOptions,
    teamColor
  }
}

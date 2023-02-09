import { Competition, Stage, TableRow, Fixture } from '~/models'

export default competitionId => {
  const competitionRepo = useRepo(Competition)
  const competition = computed(() =>
    competitionRepo
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
      .where('stageId', stage.id)
      .get()
      .map(fixture => [fixture.homeTeam, fixture.awayTeam])
    return [...new Set(names.flat())].sort()
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
    console.log(stageIndex)
    console.log(orderedRounds.value)
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

  return {
    competition,
    orderedRounds,
    previousRoundTeams,
    championOptions
  }
}

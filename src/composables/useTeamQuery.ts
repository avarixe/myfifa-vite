export default ({
  query,
  variables = null,
  onTeamQuery = (data) => {
    data
  }
}) => {
  const { teamId, teamRepo, team, currentSeason, seasonLabel } = useTeam()

  console.log(variables, variables())
  console.log(variables || (() => ({ teamId: teamId.value })))
  const { loading, ready, executeQuery } = usePageQuery({
    query,
    variables: variables || (() => ({ teamId: teamId.value })),
    onQuery(data) {
      teamRepo.save(data.team)
      onTeamQuery(data)
    }
  })

  return {
    loading,
    ready,
    executeQuery,

    teamId,
    teamRepo,
    team,
    currentSeason,
    seasonLabel
  }
}

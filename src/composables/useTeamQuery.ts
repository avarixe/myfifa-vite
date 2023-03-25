export default async ({ query, variables = null }) => {
  const { teamId, teamRepo, team, currentSeason, seasonLabel } = useTeam()

  const { data } = await useQuery({
    query,
    variables: variables || { teamId: teamId.value }
  })
  teamRepo.save(data.value?.team)

  return {
    teamId,
    teamRepo,
    team,
    currentSeason,
    seasonLabel,
    data
  }
}

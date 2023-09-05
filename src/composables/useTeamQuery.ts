export default async <T extends { team: object }>({
  query,
  variables = null
}: {
  query: ReturnType<typeof gql>
  variables?: object | null
}) => {
  const { teamId, teamRepo, team, currentSeason, seasonLabel } = useTeam()

  const { data } = await useQuery<T>({
    query,
    variables: variables || { teamId: teamId.value }
  })
  if (data.value) {
    teamRepo.save(data.value.team)
  }

  return {
    teamId,
    teamRepo,
    team,
    currentSeason,
    seasonLabel,
    data
  }
}

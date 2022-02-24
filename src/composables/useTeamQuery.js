import useTeam from './useTeam'

export default ({ query, variables, include }) => {
  const { teamId, teamRepo, team } = useTeam(include)

  const { data } = useQuery({
    query,
    variables: variables || { teamId: teamId.value }
  })

  watchEffect(() => {
    if (data.value?.team) {
      teamRepo.save(data.value?.team)
    }
  })

  return {
    teamId,
    teamRepo,
    team,
    data
  }
}

import { Team } from '~/models'

export default ({ props, query, variables, include }) => {
  const teamId = computed(() => parseInt(props.teamId))

  const { data } = useQuery({
    query,
    variables: variables || { teamId: teamId.value }
  })

  const teamRepo = useRepo(Team)
  watchEffect(() => {
    if (data.value?.team) {
      teamRepo.save(data.value?.team)
    }
  })

  const team = computed(() => {
    if (include) {
      return teamRepo.with(include).find(teamId.value)
    } else {
      return teamRepo.find(teamId.value)
    }
  })

  return {
    teamId,
    teamRepo,
    team,
    data
  }
}

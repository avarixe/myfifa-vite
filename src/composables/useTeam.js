import { Team } from '~/models'

export default include => {
  const route = useRoute()
  const teamId = computed(() => parseInt(route.params.teamId))

  const teamRepo = useRepo(Team)

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
    team
  }
}

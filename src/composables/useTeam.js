import { Team } from '~/models'

export default () => {
  const route = useRoute()
  const teamId = computed(() => parseInt(route.params.teamId))

  const teamRepo = useRepo(Team)
  const team = computed(() => teamRepo.find(teamId.value))

  return {
    teamId,
    teamRepo,
    team
  }
}

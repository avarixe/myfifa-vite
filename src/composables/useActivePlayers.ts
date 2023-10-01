import { Player } from '~/models'

export default () => {
  const { teamId } = useTeam()
  const playerRepo = useRepo(Player)
  const activePlayers = computed(
    () =>
      _orderBy(
        playerRepo
          .where('teamId', teamId.value)
          .where('status', 'Active')
          .get(),
        ['posIdx', 'ovr'],
        ['asc', 'desc']
      ) as Player[]
  )

  return { activePlayers }
}

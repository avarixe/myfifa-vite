import orderBy from 'lodash.orderby'
import { useRepo } from 'pinia-orm'

export default () => {
  const { teamId } = useTeam()
  const playerRepo = useRepo(Player)
  const activePlayers = computed(() =>
    orderBy(
      playerRepo.where('teamId', teamId.value).where('status', 'Active').get(),
      ['posIdx', 'ovr'],
      ['asc', 'desc']
    )
  )

  return { activePlayers }
}

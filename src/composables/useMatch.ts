import { Cap, Match } from '~/models'

export default (match: Match) => {
  const matchPositionList: string[] = Object.keys(matchPositions)
  const sortedCaps = computed(
    () =>
      _orderBy(
        match.caps,
        (c: Cap) => matchPositionList.indexOf(c.pos),
        'start'
      ) as Cap[]
  )

  const minute: Ref<number | null> = ref(null)
  const unsubbedPlayers = computed(
    () =>
      sortedCaps.value.filter((cap: Cap) =>
        minute.value
          ? cap.start <= minute.value && minute.value <= cap.stop
          : !cap.subbedOut
      ) as Cap[]
  )

  return {
    minute,
    sortedCaps,
    unsubbedPlayers
  }
}

import orderBy from 'lodash.orderby'
import { matchPositions } from '~/constants'

export default match => {
  const matchPositionList = Object.keys(matchPositions)
  const sortedCaps = computed(() =>
    orderBy(match.caps, c => matchPositionList.indexOf(c.pos), 'start')
  )

  const minute = ref(null)
  const unsubbedPlayers = computed(() =>
    sortedCaps.value.filter(cap =>
      minute.value
          ? cap.start <= minute.value && minute.value <= cap.stop
          : !cap.subbedOut
    )
  )

  return {
    minute,
    sortedCaps,
    unsubbedPlayers
  }
}

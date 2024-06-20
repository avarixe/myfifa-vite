import { Cap, Match } from '~/models'

export default (match: Ref<Match>) => {
  const sortedCaps = computed<Cap[]>(() =>
    _orderBy(match.value.caps, ['posIdx', 'start'])
  )

  const minute: Ref<number | null> = ref(null)
  const capsAtMinute = computed<Cap[]>(() =>
    sortedCaps.value.filter((cap: Cap) =>
      minute.value || minute.value === 0
        ? cap.start <= minute.value && minute.value <= cap.stop
        : !cap.nextId
    )
  )

  const activeCaps = computed(() =>
    capsAtMinute.value.filter(
      cap => !cap.nextId || cap.stop > (minute.value ?? match.value.endOfMatch)
    )
  )

  return {
    minute,
    sortedCaps,
    activeCaps,
    capsAtMinute
  }
}

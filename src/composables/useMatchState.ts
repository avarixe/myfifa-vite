import { Cap, Match } from '~/models'

export default (match: Ref<Match>) => {
  const sortedCaps = computed(
    () => _orderBy(match.value.caps, 'posIdx', 'start') as Cap[]
  )

  const minute: Ref<number | null> = ref(null)
  const capsAtMinute = computed(
    () =>
      sortedCaps.value.filter((cap: Cap) =>
        minute.value || minute.value === 0
          ? cap.start <= minute.value && minute.value <= cap.stop
          : !cap.nextId
      ) as Cap[]
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

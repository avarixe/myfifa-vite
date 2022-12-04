import { addYears, differenceInYears, format, parseISO } from 'date-fns'
import { Team } from '~/models'

export default () => {
  const route = useRoute()
  const teamId = computed(() => parseInt(route.params.teamId))

  const teamRepo = useRepo(Team)
  const team = computed(() => teamRepo.find(teamId.value))

  function seasonOn (date) {
    const startDate = parseISO(team.value.startedOn)
    return differenceInYears(parseISO(date), startDate)
  }

  const currentSeason = computed(() => seasonOn(team.value.currentlyOn))

  function seasonLabel (season) {
    if (!team.value) {
      return ''
    }

    const start = addYears(parseISO(team.value.startedOn), season)
    const end = addYears(start, 1)
    return `${format(start, 'yyyy')} - ${format(end, 'yyyy')}`
  }

  const startOfCurrentSeason = computed(() => {
    const date = parseISO(team.value.startedOn)
    return format(addYears(date, currentSeason.value), 'yyyy-MM-dd')
  })

  const endOfCurrentSeason = computed(() => {
    const date = parseISO(startOfCurrentSeason.value)
    return format(addYears(date, 1), 'yyyy-MM-dd')
  })

  return {
    teamId,
    teamRepo,
    team,

    seasonOn,
    currentSeason,
    seasonLabel,
    startOfCurrentSeason,
    endOfCurrentSeason
  }
}

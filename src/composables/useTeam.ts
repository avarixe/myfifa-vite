import { addYears, differenceInYears } from 'date-fns'

import { Team } from '~/models'

export default () => {
  const route = useRoute<'/teams/[teamId]/'>()
  const teamId = computed(() => Number(route.params.teamId))

  const teamRepo = useRepo(Team)
  const team = computed<Team>(() => teamRepo.find(teamId.value))

  function seasonOn(date: string): number {
    const startDate: Date = parseISO(team.value.startedOn)
    return differenceInYears(parseISO(date), startDate)
  }

  const currentSeason = computed(() => seasonOn(team.value.currentlyOn))

  function seasonLabel(season: number): string {
    if (!team.value) {
      return ''
    }

    const start: Date = addYears(parseISO(team.value.startedOn), season)
    const end: Date = addYears(start, 1)
    return `${format(start, 'yyyy')} - ${format(end, 'yyyy')}`
  }

  const startOfCurrentSeason = computed(() => {
    const date: Date = parseISO(team.value.startedOn)
    return format(addYears(date, currentSeason.value), 'yyyy-MM-dd')
  })

  const endOfCurrentSeason = computed(() => {
    const date: Date = parseISO(startOfCurrentSeason.value)
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

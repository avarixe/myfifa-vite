import { addYears, differenceInYears, format, parseISO } from 'date-fns'
import { Team } from '~/models'

export default () => {
  const route = useRoute()
  const teamId = computed(() => parseInt(route.params.teamId))

  const teamRepo = useRepo(Team)
  const team = computed(() => teamRepo.find(teamId.value))

  const currentSeason = computed(() => {
    const date = parseISO(team.value.startedOn)
    const currentDate = parseISO(team.value.currentlyOn)
    return differenceInYears(currentDate, date)
  })

  function seasonLabel (season) {
    const start = addYears(parseISO(team.value.startedOn), season)
    const end = addYears(start, 1)
    return `${format(start, 'yyyy')} - ${format(end, 'yyyy')}`
  }

  return {
    teamId,
    teamRepo,
    team,

    currentSeason,
    seasonLabel
  }
}

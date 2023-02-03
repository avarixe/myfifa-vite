<script setup>
  import { Team, Player, Match, Competition } from '~/models'

  const teamRepo = useRepo(Team)
  const playerRepo = useRepo(Player)
  const matchRepo = useRepo(Match)
  const competitionRepo = useRepo(Competition)

  const route = useRoute()
  const capitalize = str => `${str[0].toUpperCase()}${str.slice(1)}`
  const { seasonLabel } = useTeam()
  const breadcrumbs = computed(() => {
    const routeSteps = route.name === 'index'
      ? ['']
      : route.path.split('/')
    return routeSteps.map((step, i) => {
      const to = `${routeSteps.slice(0, i + 1).join('/')}`
      const prevStep = routeSteps[i - 1]
      switch (step) {
        case '': // root
          return { to: '/', text: 'Home' }
        case 'teams':
        case 'players':
        case 'matches':
        case 'squads':
        case 'competitions':
        case 'account':
        case 'development':
        case 'statistics':
          return { to, text: capitalize(step) }
        case 'analytics':
          return { to, text: capitalize(step), disabled: true }
        case 'seasons':
          return { to: to.replace(/seasons/, 'competitions'), text: capitalize(step) }
        case 'new':
          return {
            to,
            text: `New ${capitalize(prevStep).replace(/e?s$/, '')}`
          }
        case 'edit':
          const twoStepsAgo = routeSteps[i - 2]
          return {
            to,
            text: `Edit ${capitalize(twoStepsAgo).replace(/e?s$/, '')}`
          }
        default:
          switch (prevStep) {
            case 'teams':
              const team = teamRepo.find(parseInt(step))
              return { to, text: team?.name }
            case 'players':
              const player = playerRepo.find(parseInt(step))
              return { to, text: player?.name }
            case 'matches':
              const match = matchRepo.find(parseInt(step))
              return { to, text: `${match?.home} v ${match?.away}` }
            case 'competitions':
              const competition = competitionRepo.find(parseInt(step))
              return { to, text: competition?.name }
            case 'seasons':
              return { to, text: seasonLabel(parseInt(step)) }
            default:
              return { to, text: step }
          }
      }
    })
  })
</script>

<template>
  <v-breadcrumbs
    v-show="breadcrumbs.length > 1"
    :items="breadcrumbs"
    color="primary"
    class="hidden-sm-and-down"
  />
</template>

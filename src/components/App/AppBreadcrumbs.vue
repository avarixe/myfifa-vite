<script setup lang="ts">
  import { Team, Player, Match, Competition } from '~/models'

  const teamRepo = useRepo(Team)
  const playerRepo = useRepo(Player)
  const matchRepo = useRepo(Match)
  const competitionRepo = useRepo(Competition)

  const route = useRoute()
  const { seasonLabel } = useTeam()
  const breadcrumbs = computed(() => {
    const routeSteps = route.name === '/' ? [''] : route.path.split('/')
    return routeSteps.map((step, i) => {
      const to = `${routeSteps.slice(0, i + 1).join('/')}`
      const prevStep = routeSteps[i - 1]
      switch (step) {
        case '': // root
          return { to: '/', title: 'Home', exact: true }
        case 'teams':
        case 'players':
        case 'matches':
        case 'squads':
        case 'competitions':
        case 'account':
        case 'development':
        case 'statistics':
          return { to, title: capitalize(step), exact: true }
        case 'seasons':
          return {
            to: to.replace(/seasons/, 'competitions'),
            title: capitalize(step),
            exact: true
          }
        case 'new':
          return {
            to,
            title: `New ${capitalize(prevStep).replace(/e?s$/, '')}`,
            exact: true
          }
        case 'edit': {
          const twoStepsAgo = routeSteps[i - 2]
          return {
            to,
            title: `Edit ${capitalize(twoStepsAgo).replace(/e?s$/, '')}`,
            exact: true
          }
        }
        default:
          switch (prevStep) {
            case 'teams': {
              const team = teamRepo.find(parseInt(step))
              return { to, title: team?.name, exact: true }
            }
            case 'players': {
              const player = playerRepo.find(parseInt(step))
              return { to, title: player?.name, exact: true }
            }
            case 'matches': {
              const match = matchRepo.find(parseInt(step))
              return {
                to,
                title: `${match?.home} v ${match?.away}`,
                exact: true
              }
            }
            case 'competitions': {
              const competition = competitionRepo.find(parseInt(step))
              return { to, title: competition?.name, exact: true }
            }
            case 'seasons':
              return { to, title: seasonLabel(parseInt(step)), exact: true }
            default:
              return { to, title: step, exact: true }
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

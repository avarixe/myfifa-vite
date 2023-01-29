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
          return { to: '/', label: 'Home' }
        case 'teams':
        case 'players':
        case 'matches':
        case 'squads':
        case 'competitions':
        case 'account':
        case 'development':
        case 'statistics':
          return { to, label: capitalize(step) }
        case 'analytics':
        case 'seasons':
          return { to, label: capitalize(step), disabled: true }
        case 'new':
          return {
            to,
            label: `New ${capitalize(prevStep).replace(/e?s$/, '')}`
          }
        case 'edit':
          const twoStepsAgo = routeSteps[i - 2]
          return {
            to,
            label: `Edit ${capitalize(twoStepsAgo).replace(/e?s$/, '')}`
          }
        default:
          switch (prevStep) {
            case 'teams':
              const team = teamRepo.find(parseInt(step))
              return { to, label: team?.name }
            case 'players':
              const player = playerRepo.find(parseInt(step))
              return { to, label: player?.name }
            case 'matches':
              const match = matchRepo.find(parseInt(step))
              return { to, label: `${match?.home} v ${match?.away}` }
            case 'competitions':
              const competition = competitionRepo.find(parseInt(step))
              return { to, label: competition?.name }
            case 'seasons':
              return { to, label: seasonLabel(parseInt(step)) }
            default:
              return { to, label: step }
          }
      }
    })
  })
</script>

<template>
  <q-breadcrumbs v-show="breadcrumbs.length > 1">
    <q-breadcrumbs-el
      v-for="(breadcrumb, i) in breadcrumbs"
      :key="breadcrumb.label"
      :label="breadcrumb.label"
      :to="breadcrumb.to"
    />
  </q-breadcrumbs>
</template>

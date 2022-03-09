<script setup>
  import { format, parseISO } from 'date-fns'
  import { useNavigationStore } from '~/store/navigation'
  import { useTeamQuery } from '~/composables'
  import { Player } from '~/models'
  import {
    contractFragment,
    transferFragment,
    loanFragment,
    injuryFragment,
    playerFragment,
    playerHistoryFragment,
    playerPerformanceStatsFragment,
    teamFragment
  } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true },
    playerId: { type: String, required: true }
  })

  const { data, team } = await useTeamQuery({
    query: gql`
      query fetchPlayerPage($teamId: ID!, $playerId: ID!) {
        player(id: $playerId) {
          ...PlayerData
          contracts { ...ContractData }
          transfers { ...TransferData }
          loans { ...LoanData }
          injuries { ...InjuryData }
          histories { ...PlayerHistoryData }
        }
        team(id: $teamId) {
          ...TeamData
          playerPerformanceStats(playerIds: [$playerId]) {
            ...PlayerPerformanceStatsData
          }
        }
      }
      ${playerFragment}
      ${contractFragment}
      ${transferFragment}
      ${loanFragment}
      ${injuryFragment}
      ${playerHistoryFragment}
      ${teamFragment}
      ${playerPerformanceStatsFragment}
    `,
    variables: {
      teamId: props.teamId,
      playerId: props.playerId
    }
  })

  const playerRepo = useRepo(Player)
  playerRepo.save(data.value?.player)

  const player = computed(() =>
    playerRepo.withAll().find(parseInt(props.playerId))
  )

  const navigationStore = useNavigationStore()
  navigationStore.setBreadcrumbs([
    { icon: 'mdi-home', to: '/' },
    { label: 'Teams', to: '/teams' },
    { label: team.value.name, to: `/teams/${props.teamId}` },
    { label: 'Players', to: `/teams/${props.teamId}/players` },
    { label: player.value.name, to: `/teams/${props.teamId}/players/${props.playerId}` }
  ])
</script>

<template>
  <div><b>Name:</b> {{ player.name }}</div>
  <div><b>Age:</b> {{ player.age }}</div>
  <div><b>Nationality:</b> {{ player.nationality }}</div>
  <div><b>Status:</b> {{ player.status }}</div>
  <div><b>Position:</b> {{ player.pos }}</div>
  <div><b>Secondary Position(s):</b> {{ player.secPos.join(', ') }}</div>
  <div><b>Kit No:</b> {{ player.kitNo }}</div>
  <div><b>OVR:</b> {{ player.ovr }}</div>
  <div><b>Value:</b> {{ player.value }}</div>
</template>

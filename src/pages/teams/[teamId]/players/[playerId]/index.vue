<script setup>
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

  const router = useRouter()
</script>

<template>
  <h1>{{ player.name }}</h1>

  <div>
    <v-btn :to="`/teams/${team.id}/players/${player.id}/edit`">Edit</v-btn>
    &nbsp;
    <remove-button
      :record="player"
      store="Player"
      :label="player.name"
      @removed="router.push(`/teams/${team.id}/players`)"
    />
  </div>

  <div class="mt-2">
    <div><b>Status:</b> {{ player.status }}</div>
    <div><b>Age:</b> {{ player.age }}</div>
    <div><b>Position:</b> {{ player.pos }}</div>
    <div><b>Secondary Position(s):</b> {{ player.secPos.join(', ') }}</div>
    <div><b>Kit No:</b> {{ player.kitNo }}</div>
    <div><b>OVR:</b> {{ player.ovr }}</div>
    <div><b>Value:</b> {{ team.currency }}{{ player.value }}</div>
  </div>

  <contract-grid
    :player="player"
    class="mt-4"
  />

  <transfer-grid
    :player="player"
    class="mt-4"
  />

  <loan-grid
    :player="player"
    class="mt-4"
  />

  <injury-grid
    :player="player"
    class="mt-4"
  />
</template>

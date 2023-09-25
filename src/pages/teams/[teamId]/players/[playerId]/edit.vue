<script setup lang="ts">
  import { Player } from '~/models'

  const route = useRoute<'/teams/[teamId]/players/[playerId]/edit'>()

  const { data } = await useTeamQuery<{ team: object; player: object }>({
    query: gql`
      query fetchPlayerPage($teamId: ID!, $playerId: ID!) {
        player(id: $playerId) {
          ...PlayerData
          coverage {
            ${Object.keys(matchPositions).join(' ')}
          }
        }
        team(id: $teamId) {
          ...TeamData
        }
      }
      ${playerFragment}
      ${teamFragment}
    `,
    variables: {
      teamId: route.params.teamId,
      playerId: route.params.playerId
    }
  })
  const playerRepo = useRepo(Player)
  if (data.value) {
    playerRepo.save(data.value.player)
  }
  const player = computed(
    () => playerRepo.find(Number(route.params.playerId)) as Player
  )
</script>

<template>
  <div class="text-h4 mb-2">Edit Player</div>

  <player-form :record="player" />
</template>

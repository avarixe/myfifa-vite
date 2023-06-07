<script setup lang="ts">
  import { Player } from '~/models'

  const props = defineProps<{
    teamId: string
    playerId: string
  }>()

  const playerRepo = useRepo(Player)
  const player = computed(() => playerRepo.find(parseInt(props.playerId)))

  const { data } = useTeamQuery({
    query: gql`
      query fetchPlayerPage($teamId: ID!, $playerId: ID!) {
        player(id: $playerId) {
          ...PlayerData
        }
        team(id: $teamId) {
          ...TeamData
        }
      }
      ${playerFragment}
      ${teamFragment}
    `,
    variables: () => ({
      teamId: parseInt(props.teamId),
      playerId: parseInt(props.playerId)
    }),
    onTeamQuery(data) {
      playerRepo.save(data.player)
    }
  })
</script>

<template>
  <div class="text-h4 mb-2">Edit Player</div>

  <player-form :record="player" />
</template>

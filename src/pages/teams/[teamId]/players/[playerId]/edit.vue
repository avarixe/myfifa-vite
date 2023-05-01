<script setup lang="ts">
  import { Player } from '~/models'

  const props = defineProps<{
    teamId: string
    playerId: string
  }>()

  const { data } = await useTeamQuery({
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
    variables: {
      teamId: props.teamId,
      playerId: props.playerId
    }
  })
  const playerRepo = useRepo(Player)
  playerRepo.save(data.value?.player)
  const player = computed(() => playerRepo.find(parseInt(props.playerId)))
</script>

<template>
  <div class="text-h4 mb-2">Edit Player</div>

  <player-form :record="player" />
</template>

<script setup>
  import { Player } from '~/models'
  import { useTeamQuery } from '~/composables'
  import { playerFragment, teamFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true },
    playerId: { type: String, required: true }
  })

  const { data } = await useTeamQuery({
    query: gql`
      query fetchPlayerPage($teamId: ID!, $playerId: ID!) {
        player(id: $playerId) { ...PlayerData }
        team(id: $teamId) { ...TeamData }
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
  const player = computed(() =>
    playerRepo.find(parseInt(props.playerId))
  )
</script>

<template>
  <router-link :to="`/teams/${props.teamId}/players/${player.id}`">Back</router-link>

  <h1>Edit Player</h1>

  <player-form :record="player" />
</template>

<script setup>
  import { Player } from '~/models'

  const props = defineProps({
   caps: { type: Array, default: () => [] },
  })

  const playerPositions = computed(() =>
    props.caps.reduce((obj, cap) => ({
      ...obj,
      [cap.playerId]: cap.pos
    }), {})
  )

  const playerRepo = useRepo(Player)
  const matchPositionList = Object.keys(matchPositions)
  const players = computed(() =>
    orderBy(
      playerRepo.where('id', props.caps.map(cap => cap.playerId)).get(),
      player => matchPositionList.indexOf(playerPositions.value[player.id])
    )
  )
</script>

<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="players"
    item-title="name"
    item-value="id"
  />
</template>

<script setup>
  const props = defineProps({
    cap: { type: Object, required: true }
  })

  const pos = ref(props.cap.pos)
  const playerId = ref(props.cap.playerId)

  watchEffect(() => {
    pos.value = props.cap.pos
    playerId.value = props.cap.playerId
  })

  const { activePlayers } = useActivePlayers()

  function onPositionChange () {
  }

  function onPlayerChange () {
  }
</script>

<template>
  <div class="pa-2">
    <div class="text-subtitle-2 pb-2">
      Edit Position and Player
    </div>
    <v-select
      v-model="pos"
      label="Position"
      prepend-icon="mdi-run"
      :items="Object.keys(matchPositions)"
      menu-props="auto"
      required
      @change="onPositionChange"
    />
    <player-select
      v-model="playerId"
      :players="activePlayers"
      item-value="id"
      required
      :disabled="cap.start > 0"
      @input="onPlayerChange"
    />
  </div>
</template>

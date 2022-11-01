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

  const { executeMutation: updateCap } = useMutation(gql`
    mutation ($id: ID!, $attributes: CapAttributes!) {
      updateCap(id: $id, attributes: $attributes) {
        cap { ...CapData }
        errors { fullMessages }
      }
    }
    ${capFragment}
  `)

  const emit = defineEmits(['submitted'])

  async function onPositionChange () {
    const { data: { updateCap: { errors } } } = await updateCap({
      id: props.cap.id,
      attributes: { pos: pos.value }
    })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      emit('submitted')
    }
  }

  async function onPlayerChange () {
    const { data: { updateCap: { errors } } } = await updateCap({
      id: props.cap.id,
      attributes: { playerId: playerId.value }
    })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      emit('submitted')
    }
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
      @update:modelValue="onPositionChange"
    />
    <player-select
      v-model="playerId"
      :players="activePlayers"
      item-value="id"
      prepend-icon="mdi-account"
      :disabled="cap.start > 0"
      @update:modelValue="onPlayerChange"
    />
  </div>
</template>

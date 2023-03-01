<script setup>
  const props = defineProps({
    cap: { type: Object, required: true }
  })

  const attributes = reactive({})
  watchEffect(() => {
    attributes.pos = props.cap.pos
    attributes.playerId = props.cap.playerId
  })

  const { activePlayers } = useActivePlayers()

  const emit = defineEmits(['submitted'])
  const { submitForm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: CapAttributes!) {
        updateCap(id: $id, attributes: $attributes) {
          cap {
            ...CapData
          }
        }
      }
      ${capFragment}
    `,
    variables: () => ({ id: props.cap.id, attributes }),
    onSuccess() {
      emit('submitted')
    }
  })
</script>

<template>
  <div class="pa-2">
    <div class="text-subtitle-2 pb-2">Edit Position and Player</div>
    <v-select
      v-model="attributes.pos"
      label="Position"
      prepend-icon="mdi-run"
      :items="Object.keys(matchPositions)"
      @update:model-value="submitForm"
    />
    <player-select
      v-model="attributes.playerId"
      :players="activePlayers"
      item-value="id"
      prepend-icon="mdi-account"
      :disabled="cap.start > 0"
      @update:model-value="submitForm"
    />
  </div>
</template>

<script setup>
  const props = defineProps({
    player: { type: Object, required: true },
    attribute: { type: String, required: true },
    label: { type: String, required: true }
  })

  const modelValue = ref(null)
  watchEffect(() => {
    modelValue.value = props.player[props.attribute]
  })

  const { executeMutation: updatePlayer } = useMutation(gql`
    mutation ($id: ID!, $attributes: PlayerAttributes!) {
      updatePlayer(id: $id, attributes: $attributes) {
        player { ...PlayerData }
        errors { fullMessages }
      }
    }
    ${playerFragment}
  `)
  async function updateAttribute () {
    if (modelValue.value !== props.player[props.attribute]) {
      const { data: { updatePlayer: { errors } } } = await updatePlayer({
        id: props.player.id,
        attributes: { [props.attribute]: modelValue.value }
      })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    }
  }
</script>

<template>
  <inline-field
    :display-value="player[attribute]"
    :tooltip="`Click to Edit ${label}`"
    @closed="updateAttribute"
  >
    <template #display>
      <slot name="display" />
    </template>
    <template #form="{ closeMenu }">
      <v-text-field
        v-model.number="modelValue"
        :label="label"
        hide-details
        variant="solo"
        density="compact"
        type="number"
        autofocus
        @keydown.enter="closeMenu"
      />
    </template>
  </inline-field>
</template>

<script setup lang="ts">
  import { Player } from '~/models'

  const props = defineProps<{
    player: Player
    attribute: string
    label: string
  }>()

  const modelValue = ref(null)
  watchEffect(() => {
    modelValue.value = props.player[props.attribute]
  })

  const { submitForm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: PlayerAttributes!) {
        updatePlayer(id: $id, attributes: $attributes) {
          player {
            ...PlayerData
          }
        }
      }
      ${playerFragment}
    `,
    variables: () => ({
      id: props.player.id,
      attributes: { [props.attribute]: modelValue.value }
    })
  })

  async function updateAttribute() {
    if (modelValue.value !== props.player[props.attribute]) {
      submitForm()
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
      <slot
        name="form"
        :model-value="modelValue"
        :update-model-value="
          value => {
            modelValue = value
          }
        "
        :close-menu="closeMenu"
      >
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
      </slot>
    </template>
  </inline-field>
</template>

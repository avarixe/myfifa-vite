<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{
    modelValue: number | null
    match: Match
  }>()

  const emit = defineEmits(['update:modelValue'])

  onMounted(() => {
    props.modelValue || emit('update:modelValue', 1)
  })

  function decrement() {
    emit(
      'update:modelValue',
      props.modelValue && props.modelValue > 1 ? props.modelValue - 1 : 1
    )
  }

  function increment() {
    emit(
      'update:modelValue',
      Number(props.modelValue) < props.match.endOfMatch
        ? Number(props.modelValue) + 1
        : props.match.endOfMatch
    )
  }
</script>

<template>
  <div class="text-caption text-medium-emphasis">Minute</div>
  <v-slider
    :label="`${modelValue ?? 0}'`"
    step="1"
    :min="1"
    :max="match.endOfMatch"
    append-icon="mdi-plus"
    prepend-icon="mdi-minus"
    :model-value="modelValue ?? undefined"
    @update:model-value="emit('update:modelValue', $event)"
    @click:append="increment"
    @click:prepend="decrement"
  />
</template>

<script setup lang="ts">
  import { Match } from '~/models'

  defineProps<{
    modelValue: number | null
    match: Match
  }>()

  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <v-slider
    label="Minute"
    step="1"
    :min="0"
    :max="match.endOfMatch"
    :model-value="modelValue ?? undefined"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #append> {{ modelValue ?? 0 }}' </template>
  </v-slider>
</template>

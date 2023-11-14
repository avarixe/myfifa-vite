<script setup lang="ts">
  import { Match } from '~/models'

  defineProps<{
    modelValue: number | null
    match: Match
  }>()

  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <v-select
    label="Minute"
    prepend-icon="mdi-timer"
    :items="Array.from({ length: match.endOfMatch }, (_, i) => i + 1)"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

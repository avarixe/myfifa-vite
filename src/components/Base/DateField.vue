<script setup>
  defineProps({
    prefill: { type: String, default: null }
  })
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    type="date"
    :append-icon="prefill ? 'mdi-calendar-arrow-left' : null"
    @click:append="$emit('update:modelValue', prefill)"
  />
</template>

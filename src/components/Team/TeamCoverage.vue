<script setup lang="ts">
  defineProps<{ coverage: Record<string, number> }>()

  function cellColor(pos: string, cell: { value: number | null }) {
    if (cell.value === null) {
      return pos === 'GK' ? 'red' : 'rgba(255, 255, 255, 0.2)'
    } else if (cell.value >= 7) {
      return 'green-darken-2'
    } else if (cell.value >= 5) {
      return 'light-green-lighten-1'
    } else if (cell.value >= 3) {
      return 'light-green-lighten-3'
    } else if (cell.value >= 1) {
      return 'light-green-lighten-4'
    } else {
      return 'rgba(255, 255, 255, 0.2)'
    }
  }
</script>

<template>
  <coverage-grid :coverage-data="coverage" :cell-color="cellColor">
    <template #filled-pos="{ pos }">
      {{ pos }}
    </template>
  </coverage-grid>
</template>

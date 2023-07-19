<script setup lang="ts">
  defineProps<{ coverage: { [key: string]: number } }>()

  function cellColor(pos: string, cell: { value: number | null }) {
    if (!cell.value) {
      return pos === 'GK' ? 'red' : 'rgba(255, 255, 255, 0.2)'
    } else if (cell.value <= 1) {
      return 'light-green-lighten-4'
    } else if (cell.value <= 1.5) {
      return 'light-green-lighten-2'
    } else if (cell.value <= 2.5) {
      return 'light-green'
    } else {
      return 'green-darken-2'
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

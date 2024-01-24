<script setup lang="ts">
  import { Player } from '~/models'

  defineProps<{ player: Player }>()

  function cellColor(_pos: string, cell: { value: number | null }) {
    if (cell.value === null) {
      return 'rgba(0, 0, 0, 0.4)'
    } else if (cell.value < 500) {
      return 'light-green-lighten-4'
    } else if (cell.value < 1000) {
      return 'light-green-lighten-3'
    } else if (cell.value < 1500) {
      return 'light-green-lighten-2'
    } else if (cell.value < 2000) {
      return 'light-green'
    } else if (cell.value < 2500) {
      return 'green'
    } else if (cell.value < 3000) {
      return 'green-darken-1'
    } else {
      return 'green-darken-2'
    }
  }
</script>

<template>
  <coverage-grid :coverage-data="player.coverage" :cell-color="cellColor">
    <template #filled-pos="{ pos }">
      {{ pos }}
    </template>
  </coverage-grid>
</template>

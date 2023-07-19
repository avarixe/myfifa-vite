<script setup lang="ts">
  import { Player } from '~/models'

  defineProps<{ player: Player }>()

  function cellColor(_pos: string, cell: { value: number | null }) {
    switch (cell.value) {
      case 1:
        return 'green-darken-2'
      case 2:
        return 'light-green-lighten-2'
      default:
        return 'rgba(0, 0, 0, 0.4)'
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

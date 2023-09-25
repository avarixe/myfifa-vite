<script setup lang="ts" generic="T">
  const props = defineProps<{
    coverageData: { [key: string]: T }
    cellColor: (pos: string, cell: { value: T }) => string
  }>()

  interface CoverageMap {
    [key: string]: { value: T }
  }

  const coverage: Ref<CoverageMap> = computed(() =>
    Object.keys(matchPositions).reduce((obj: CoverageMap, pos) => {
      obj[pos] = {
        value: props.coverageData[pos]
      }
      return obj
    }, {})
  )

  function cellBorderRadius(coordinates: number[]) {
    switch (coordinates.join('-')) {
      case '0-1':
      case '3-0':
        return 'rounded-ts'
      case '0-3':
      case '3-4':
        return 'rounded-te'
      case '1-0':
        return 'rounded-s'
      case '1-4':
        return 'rounded-e'
      case '5-0':
        return 'rounded-bs'
      case '5-4':
        return 'rounded-be'
      case '6-2':
        return 'rounded-b'
    }
  }
</script>

<template>
  <formation-grid :cells="coverage" no-padding>
    <template #filled-pos="{ pos, cell, coordinates }">
      <v-sheet
        :color="cellColor(pos, cell)"
        :class="['w-100', cellBorderRadius(coordinates)]"
      >
        <slot name="filled-pos" :pos="pos" :cell="cell" />
      </v-sheet>
    </template>
  </formation-grid>
</template>

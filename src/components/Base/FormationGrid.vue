<script setup lang="ts" generic="T">
  defineProps<{
    cells: Record<string, T>
    hideEmptyCells?: boolean
    noPadding?: boolean
  }>()

  const positions = [
    [null, 'LS', 'ST', 'RS', null],
    ['LW', 'LF', 'CF', 'RF', 'RW'],
    [null, 'LAM', 'CAM', 'RAM', null],
    ['LM', 'LCM', 'CM', 'RCM', 'RM'],
    ['LWB', 'LDM', 'CDM', 'RDM', 'RWB'],
    ['LB', 'LCB', 'CB', 'RCB', 'RB'],
    [null, null, 'GK', null, null]
  ]
</script>

<template>
  <v-row
    v-for="(row, i) in positions"
    :key="i"
    :justify="noPadding ? 'center' : 'space-around'"
    dense
    :no-gutters="noPadding"
  >
    <v-col
      v-for="(position, j) in row"
      :key="j"
      cols="2"
      class="d-flex align-center justify-center text-center"
    >
      <template v-if="position">
        <slot
          v-if="cells[position]"
          name="filled-pos"
          :pos="position"
          :cell="cells[position] as T"
          :coordinates="[i, j]"
        />
        <slot v-else-if="!hideEmptyCells" name="empty-pos" :pos="position" />
      </template>
    </v-col>
  </v-row>
</template>

<script setup>
  defineProps({
    cells: { type: Object, required: true },
    hideEmptyCells: { type: Boolean, default: false }
  })

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
    justify="space-around"
    dense
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
          :cell="cells[position]"
        />
        <slot
          v-else-if="!hideEmptyCells"
          name="empty-pos"
          :pos="position"
        />
      </template>
    </v-col>
  </v-row>
</template>

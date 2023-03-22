<script setup lang="ts">
  defineProps({
    stages: { type: Array, default: () => [] },
    readonly: { type: Boolean, default: false }
  })
</script>

<template>
  <v-row dense>
    <v-col
      v-for="stage in stages"
      :key="stage.id"
      cols="12"
      :lg="stages.length === 1 ? 12 : 6"
      :xl="stages.length === 1 ? 12 : stages === 2 ? 6 : 4"
    >
      <stage-group-table
        v-if="stage.table"
        :stage="stage"
        :readonly="readonly"
        :is-named="stages.length > 1"
      />
      <stage-round-table
        v-else
        :stage="stage"
        :readonly="readonly"
        :is-named="stages.length > 1"
      />
    </v-col>
  </v-row>
</template>

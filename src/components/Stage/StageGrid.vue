<script setup lang="ts">
  import { Stage } from '~/models'

  const props = withDefaults(
    defineProps<{ stages: Stage[]; readonly: boolean }>(),
    {
      stages: () => [],
      readonly: false
    }
  )
</script>

<template>
  <v-row dense>
    <v-col
      v-for="stage in stages"
      :key="stage.id"
      cols="12"
      :lg="stages.length === 1 ? 12 : 6"
      :xl="stages.length === 1 ? 12 : stages.length === 2 ? 6 : 4"
    >
      <stage-group-table
        v-if="stage.table"
        :stage="stage"
        :readonly="props.readonly"
        :is-named="stages.length > 1"
      />
      <stage-round-table
        v-else
        :stage="stage"
        :readonly="props.readonly"
        :is-named="stages.length > 1"
      />
    </v-col>
  </v-row>
</template>

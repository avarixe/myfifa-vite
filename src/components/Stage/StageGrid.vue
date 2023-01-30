<script setup>
  const props = defineProps({
    stages: { type: Array, default: () => [] }
  })

  const lgWidth = computed(() => props.stages.length === 1 ? 12 : 6)
  const xlWidth = computed(() => props.stages.length === 1 ? 12 : (props.stages.length === 2 ? 6 : 4))
</script>

<template>
  <div class="row q-gutter-sm">
    <div
      v-for="stage in stages"
      :key="stage.id"
      :class="`col col-12 col-lg-${lgWidth} col-xl-${xlWidth}`"
    >
      <stage-group-table
        v-if="stage.table"
        :stage="stage"
        :is-named="stages.length > 1"
      />
      <stage-round-table
        v-else
        :stage="stage"
        :is-named="stages.length > 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      formatter: (x: number) => number | string
      startValue: number
      endValue: number
    }>(),
    {
      formatter: (x: number) => x
    }
  )

  const valueIncreased = computed(() => props.startValue <= props.endValue)
  const color = computed(() => (valueIncreased.value ? 'green' : 'red'))
  const icon = computed(
    () => `mdi-menu-${valueIncreased.value ? 'up' : 'down'}`
  )

  const percentage = computed(
    () => Math.abs((props.endValue - props.startValue) / props.startValue) * 100
  )
</script>

<template>
  <div :class="`text-${color}`">
    <v-icon :color="color" :icon="icon" />
    {{ formatter(endValue) }}

    <!-- TODO: instead of tooltip, have old value with an up arrow shown below -->
    <v-tooltip activator="parent" location="bottom">
      {{ valueIncreased ? 'Increased' : 'Decreased' }} from
      {{ formatter(startValue) }} by {{ percentage.toFixed(2) }}%
    </v-tooltip>
  </div>
</template>

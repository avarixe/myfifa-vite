<script setup>
  const props = defineProps({
    formatter: { type: Function, default: x => x },
    startValue: { type: [String, Number], default: null },
    endValue: { type: [String, Number], default: null }
  })

  const valueIncreased = computed(() => props.startValue <= props.endValue)
  const color = computed(() => valueIncreased.value ? 'green' : 'red')
  const icon = computed(() => `mdi-menu-${valueIncreased.value ? 'up' : 'down'}`)

  const percentage = computed(() =>
    Math.abs((props.endValue - props.startValue) / props.startValue) * 100
  )
</script>

<template>
  <div :class="`text-${color}`">
    <q-icon :color="color" :name="icon" />
    {{ formatter(endValue) }}

    <!-- TODO: instead of tooltip, have old value with an up arrow shown below -->
    <q-tooltip>
      {{ valueIncreased ? 'Increased' : 'Decreased' }} from
      {{ formatter(startValue) }} by {{ percentage.toFixed(2) }}%
    </q-tooltip>
  </div>
</template>

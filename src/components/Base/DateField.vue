<script setup>
  const props = defineProps({
    modelValue: { type: String, default: null },
    label: { type: String, default: null },
    prefill: { type: String, default: null },
    density: { type: String, default: 'comfortable' },
    hideDetails: { type: Boolean, default: false }
  })

  const humanizedValue = computed(() => {
    return formatDate(props.modelValue, 'MMM d, yyyy')
  })

  const theme = useTheme()
</script>

<template>
  <date-picker
    auto-apply
    model-type="yyyy-MM-dd"
    :dark="theme.global.current.value.dark"
    :offset="-12"
    position="left"
    :enable-time-picker="false"
    :transitions="{ menuAppear: 'scale-transition' }"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #trigger>
      <slot name="trigger">
        <v-text-field
          :model-value="humanizedValue"
          :label="label"
          :density="density"
          readonly
          :hide-details="hideDetails"
          :append-icon="prefill ? 'mdi-calendar-arrow-left' : null"
          @click:append="$emit('update:modelValue', prefill)"
        />
      </slot>
    </template>
  </date-picker>
</template>

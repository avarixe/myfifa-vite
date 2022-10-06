<script setup>
  const props = defineProps({
    record: { type: Object, required: true },
    attribute: { type: String, required: true },
    label: { type: String, default: null },
    options: { type: Array, default: () => [] }
  })

  const modelValue = computed(() => props.record[props.attribute])
  const displayValue = computed(() =>
    !!modelValue.value || modelValue === 0 ? modelValue.value : '-'
  )
</script>

<template>
  <v-badge floating color="transparent" icon="mdi-circle-edit-outline">
    {{ displayValue }}

    <v-tooltip activator="parent" location="bottom">
      Click to Edit {{ label }}
    </v-tooltip>

    <v-menu activator="parent" auto>
      <v-list density="compact">
        <v-list-item
          v-for="(option, i) in options"
          :key="i"
          :title="option"
          :input-value="modelValue === option"
          @click="$emit('change', option)"
        />
      </v-list>
    </v-menu>
  </v-badge>
</template>

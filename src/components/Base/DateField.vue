<script setup lang="ts">
  const props = defineProps<{
    modelValue?: string | null
    prefill?: string
    min?: string | null
    max?: string | null
  }>()

  const humanizedValue = computed(() =>
    props.modelValue ? formatDate(props.modelValue, 'MMM d, yyyy') : ''
  )

  const date = computed(() =>
    props.modelValue ? parseISO(props.modelValue) : null
  )

  const menu = ref(false)

  const emit = defineEmits(['update:modelValue'])
  function onCalendarUpdate(value: Date) {
    emit('update:modelValue', format(value, 'yyyy-MM-dd'))
    menu.value = false
  }
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="humanizedValue"
    readonly
    :append-icon="prefill ? 'mdi-calendar-arrow-left' : undefined"
    @click:append="emit('update:modelValue', prefill)"
    @click:clear="emit('update:modelValue', null)"
  >
    <v-menu v-model="menu" activator="parent" :close-on-content-click="false">
      <v-date-picker
        :min="min"
        :max="max"
        :model-value="date"
        @update:model-value="onCalendarUpdate"
      />
    </v-menu>
  </v-text-field>
</template>

<style scoped lang="scss">
  :deep(.v-overlay__content) {
    min-width: auto !important;
  }
</style>

<script setup lang="ts">
  const props = defineProps<{
    modelValue?: string
    prefill?: string
    min?: string
    max?: string
  }>()

  const humanizedValue = computed(() =>
    props.modelValue ? formatDate(props.modelValue, 'MMM d, yyyy') : ''
  )

  const menu = ref(false)

  const emit = defineEmits(['update:modelValue'])
  function onCalendarUpdate(value: string) {
    emit('update:modelValue', value)
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
    <v-menu v-model="menu" activator="parent">
      <date-picker
        inline
        auto-apply
        model-type="yyyy-MM-dd"
        week-start="0"
        :min-date="min"
        :max-date="max"
        dark
        :enable-time-picker="false"
        :model-value="modelValue"
        @update:model-value="onCalendarUpdate"
      />
    </v-menu>
  </v-text-field>
</template>

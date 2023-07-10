<script setup lang="ts">
  const props = defineProps<{
    modelValue?: string
    prefill?: string
    minDate?: string
    maxDate?: string
  }>()

  const humanizedValue = computed(() => {
    return formatDate(props.modelValue, 'MMM d, yyyy')
  })

  const menu = ref(false)

  const emit = defineEmits(['update:modelValue'])
  function onCalendarUpdate(value) {
    emit('update:modelValue', value)
    menu.value = false
  }
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="humanizedValue"
    readonly
    :append-icon="prefill ? 'mdi-calendar-arrow-left' : null"
    @click:append="emit('update:modelValue', prefill)"
    @click:clear="emit('update:modelValue', null)"
  >
    <v-menu v-model="menu" activator="parent">
      <date-picker
        inline
        auto-apply
        model-type="yyyy-MM-dd"
        week-start="0"
        :min-date="minDate"
        :max-date="maxDate"
        dark
        :enable-time-picker="false"
        :model-value="modelValue"
        @update:model-value="onCalendarUpdate"
      />
    </v-menu>
  </v-text-field>
</template>

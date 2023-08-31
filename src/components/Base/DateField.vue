<script setup lang="ts">
  const props = defineProps<{
    modelValue?: string
    prefill?: string
    min?: string
    max?: string
  }>()

  const humanizedValue = computed(() => {
    props.modelValue ? formatDate(props.modelValue, 'MMM d, yyyy') : ''
  })

  const menu = ref(false)

  const emit = defineEmits(['update:modelValue'])
  // TODO: set type when vuetify fixes event typing
  function onCalendarUpdate(value: unknown) {
    emit('update:modelValue', format(value as Date, 'yyyy-MM-dd'))
    menu.value = false
  }

  const inputMode: Ref<'calendar' | 'keyboard'> = ref('calendar')
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
        v-model:input-mode="inputMode"
        :hide-actions="inputMode === 'calendar'"
        :min="min"
        :max="max"
        :model-value="[modelValue]"
        @update:model-value="onCalendarUpdate"
        @click:cancel="menu = false"
      />
    </v-menu>
  </v-text-field>
</template>

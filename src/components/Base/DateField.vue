<script setup>
  const props = defineProps({
    modelValue: { type: String, default: null },
    prefill: { type: String, default: null }
  })

  const humanizedValue = computed(() => {
    return formatDate(props.modelValue, 'MMM d, yyyy')
  })

  const theme = useTheme()

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
  >
    <v-menu
      v-model="menu"
      persistent
      :close-on-content-click="false"
      activator="parent"
    >
      <v-sheet width="260px">
        <date-picker
          inline
          auto-apply
          model-type="yyyy-MM-dd"
          week-start="0"
          :dark="theme.global.current.value.dark"
          :enable-time-picker="false"
          :model-value="modelValue"
          @update:model-value="onCalendarUpdate"
        />
        <v-btn block @click="menu = false">Close</v-btn>
      </v-sheet>
    </v-menu>
  </v-text-field>
</template>

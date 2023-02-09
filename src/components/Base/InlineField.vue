<script setup>
  defineProps({
    displayValue: { type: [String, Number], default: null },
    tooltip: { type: String, default: null }
  })

  const menu = ref(false)
  const emit = defineEmits(['closed'])
  watch(menu, open => {
    !open && emit('closed')
  })
</script>

<template>
  <v-badge floating color="transparent" icon="mdi-circle-edit-outline">
    <slot name="display">
      {{ displayValue || '-' }}
    </slot>

    <v-tooltip
      v-if="tooltip"
      activator="parent"
      location="bottom"
      :text="tooltip"
    />

    <v-menu
      v-model="menu"
      activator="parent"
      location="center"
      :close-on-content-click="false"
    >
      <v-card>
        <slot name="form" :close-menu="() => (menu = false)" />
      </v-card>
    </v-menu>
  </v-badge>
</template>

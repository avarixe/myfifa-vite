<script setup>
  defineProps({
    confirmText: { type: String, required: true },
    confirmColor: { type: String, default: 'primary' }
  })

  const dialog = ref(false)
  const emit = defineEmits(['open', 'close', 'confirm'])
  watchEffect(() => {
    if (dialog.value) {
      emit('open')
    } else {
      emit('close')
    }
  })

  const slots = useSlots()
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="400px"
    activator="parent"
  >
    <v-card>
      <v-card-text>
        <div class="text-h6">{{ confirmText }}</div>
        <slot name="details" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-text="'No'"
          @click="dialog = false"
        />
        <v-btn
          :color="confirmColor"
          v-text="'Yes'"
          @click="emit('confirm')"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      confirmText: string
      confirmColor?: string
    }>(),
    { confirmColor: 'primary' }
  )

  const dialog = ref(false)
  const emit = defineEmits(['open', 'close', 'confirm'])
  watchEffect(() => {
    if (dialog.value) {
      emit('open')
    } else {
      emit('close')
    }
  })
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="400px" activator="parent">
    <v-card>
      <v-card-text>
        <div class="text-h6">{{ confirmText }}</div>
        <slot name="details" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialog = false">No</v-btn>
        <v-btn :color="confirmColor" @click="emit('confirm')">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

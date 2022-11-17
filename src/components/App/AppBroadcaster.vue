<script setup>
  const broadcastStore = useBroadcastStore()

  const snackbar = ref(false)
  watchEffect(() => {
    snackbar.value = broadcastStore.text.length > 0
  })

  watch(snackbar, open => {
    !open && broadcastStore.clear()
  })
</script>

<template>
  <v-snackbar v-model="snackbar">
    {{ broadcastStore.text }}
    <template #actions>
      <v-btn
        :color="broadcastStore.color"
        variant="text"
        @click="snackbar = false"
      />
    </template>
  </v-snackbar>
</template>

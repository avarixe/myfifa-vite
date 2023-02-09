<script setup>
  const props = defineProps({
    submit: { type: Function, required: true },
    resetAfterSubmit: { type: Boolean, default: true }
  })

  const form = ref(null)
  const key = ref(0)
  const loading = ref(false)
  const valid = ref(false)

  function resetForm() {
    key.value++
    form.value.reset()
  }

  const emit = defineEmits(['submitted', 'reset'])
  const broadcastStore = useBroadcastStore()
  async function submitForm() {
    if (form.value.validate()) {
      try {
        loading.value = true
        broadcastStore.clear()
        await props.submit()
        emit('submitted')
        if (props.resetAfterSubmit) {
          resetForm()
          emit('reset')
        }
      } catch (err) {
        broadcastStore.error(err.message)
      } finally {
        loading.value = false
      }
    }
  }

  onMounted(() => {
    broadcastStore.error('hello world!')
  })
</script>

<template>
  <v-form ref="form" :key="key" v-model="valid" @submit.prevent="submitForm">
    <slot :loading="loading" :valid="valid" />
  </v-form>
</template>

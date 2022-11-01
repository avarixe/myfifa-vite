<script setup>
  const props = defineProps({
    submit: { type: Function, required: true },
    resetAfterSubmit: { type: Boolean, default: true }
  })

  const form = ref(null)
  const key = ref(0)
  const error = ref(false)
  const errorMessage = ref('')
  const loading = ref(false)
  const valid = ref(false)

  function resetForm () {
    key.value++
    form.value.reset()
  }

  const emit = defineEmits(['submitted', 'reset'])
  async function submitForm () {
    if (form.value.validate()) {
      try {
        loading.value = true
        error.value = false
        await props.submit()
        emit('submitted')
        if (props.resetAfterSubmit) {
          resetForm()
          emit('reset')
        }
      } catch (err) {
        errorMessage.value = err.message
        error.value = true
      } finally {
        loading.value = false
      }
    }
  }
</script>

<template>
  <v-form
    ref="form"
    :key="key"
    v-model="valid"
    @submit.prevent="submitForm"
  >
    <slot
      :error="error"
      :error-message="errorMessage"
      :on-error-input="val => error = val"
      :loading="loading"
      :valid="valid"
    />
  </v-form>
</template>

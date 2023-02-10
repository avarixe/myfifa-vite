export default ({
  onSubmit = () => {},
  onSuccess = () => {},
  onReset = () => {},
  resetAfterSubmit = true
}) => {
  const form = ref(null)
  const formKey = ref(0)
  const formIsLoading = ref(false)
  const formIsValid = ref(false)

  function resetForm() {
    formKey.value++
    form.value.reset()
  }

  const broadcastStore = useBroadcastStore()
  async function submitForm() {
    if (form.value.validate()) {
      try {
        formIsLoading.value = true
        broadcastStore.clear()
        await onSubmit()
        onSuccess()
        if (resetAfterSubmit) {
          resetForm()
          onReset()
        }
      } catch (err) {
        broadcastStore.error(err.message)
      } finally {
        formIsLoading.value = false
      }
    }
  }

  return {
    form,
    formKey,
    formIsLoading,
    formIsValid,
    submitForm,
    resetForm
  }
}

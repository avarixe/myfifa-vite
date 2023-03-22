export default ({
  mutation,
  variables = () => ({}),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onSuccess = (_) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onReset = () => {},
  resetAfterSubmit = true,
  broadcastErrors = true
}) => {
  const form = ref(null)
  const formKey = ref(0)
  const formIsLoading = ref(false)
  const formIsValid = ref(false)
  const formError = ref('')

  function resetForm() {
    formKey.value++
    form.value.reset()
  }

  const { executeMutation } = useMutation(mutation)

  const broadcastStore = useBroadcastStore()
  async function submitForm() {
    if (form.value === null || form.value.validate()) {
      formIsLoading.value = true
      formError.value = ''
      broadcastStore.clear()
      const { data, error } = await executeMutation(variables())
      if (error) {
        formError.value = error.graphQLErrors?.[0]?.message ?? error.message
        if (broadcastErrors) {
          broadcastStore.error(formError.value)
        }
      } else {
        await onSuccess(data)
        if (form.value && resetAfterSubmit) {
          resetForm()
          onReset()
        }
      }
      formIsLoading.value = false
    }
  }

  function dismissError() {
    formError.value = ''
  }

  return {
    form,
    formKey,
    formIsLoading,
    formIsValid,
    formError,
    submitForm,
    resetForm,
    dismissError
  }
}

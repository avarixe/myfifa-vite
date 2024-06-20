import { VForm } from 'vuetify/components'

export default <T>({
  mutation,
  variables = () => ({}),
  onSuccess = (data: T) => {
    data
  },
  onReset = () => {
    // do nothing
  },
  resetAfterSubmit = true,
  broadcastErrors = true
}: {
  mutation: ReturnType<typeof gql>
  variables?: () => object
  onSuccess?: (data: T) => void
  onReset?: () => void
  resetAfterSubmit?: boolean
  broadcastErrors?: boolean
}) => {
  const form = ref<VForm | null>(null)
  const formKey = ref(0)
  const formIsLoading = ref(false)
  const formIsValid = ref(false)
  const formError = ref('')

  function resetForm() {
    formKey.value++
    form.value?.reset()
  }

  const { executeMutation } = useMutation(mutation)

  const broadcastStore = useBroadcastStore()
  async function submitForm() {
    if (form.value === null || (await form.value.validate())) {
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
        assertType<T>(data)
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

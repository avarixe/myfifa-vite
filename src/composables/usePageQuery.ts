export default ({
  query,
  variables = null,
  onQuery = (data) => {
    data
  }
}) => {
  const { data, executeQuery } = useQuery({
    query,
    variables,
    pause: true
  })

  const ready = ref(false)
  const loading = ref(false)
  const route = useRoute()
  watch(route, async () => {
    try {
      ready.value = false
      loading.value = true
      await executeQuery()
      onQuery(data.value)
      ready.value = true
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }, { immediate: true })

  return { loading, ready, executeQuery }
}

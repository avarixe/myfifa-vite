export default ({
  url,
  options = ref({ page: 0, itemsPerPage: 10 }),
  onFetch = (_) => {},
  formatOptions = options => ({
    page: options.page + 1,
    page_length: options.itemsPerPage,
    ...(options.sortBy && {
      sort: {
        [options.sortBy]: options.sortDesc ? 'desc' : 'asc'
      }
    })
  })
}) => {
  const fetchOptions = computed(() => formatOptions(options.value))

  const loading = ref(false)
  async function fetchPage() {
    try {
      loading.value = true
      const { data } = await axios.get(url, { params: fetchOptions.value })
      await onFetch(data)
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const fetchTimeout = ref(null)
  watch(
    fetchOptions,
    () => {
      clearTimeout(fetchTimeout.value)
      fetchTimeout.value = setTimeout(fetchPage, 300)
    },
    { immediate: true }
  )

  return {
    loading,
    options
  }
}

<script setup>
  const props = defineProps({
    modelValue: { type: String, default: null },
    defaultItems: { type: Array, default: () => [] }
  })

  const items = ref([])
  watch(() => props.defaultItems, defaultItems => {
    items.value = defaultItems
  }, { deep: true, immediate: true })

  const textValue = ref(props.modelValue)
  const { data, executeQuery } = useQuery({
    query: gql`
      query fetchTeamOptions($category: OptionCategory!, $search: String) {
        options(category: $category, search: $search)
      }
    `,
    variables: {
      category: 'Team',
      search: textValue
    },
    pause: true
  })

  const timeout = ref(null)
  onBeforeUnmount(() => {
    clearTimeout(timeout.value)
  })

  async function filter (inputValue, doneFn, _abortFn) {
    clearTimeout(timeout.value)
    doneFn(() => {
      if (items.value.includes(inputValue)) {
        items.value = []
      } else if (inputValue.length >= 3) {
        textValue.value = inputValue
        timeout.value = setTimeout(() => searchItems(), 300)
      } else {
        items.value = props.defaultItems
      }
    })
  }

  const loading = ref(false)
  async function searchItems () {
    try {
      loading.value = true
      await executeQuery()
      const { options } = data.value
      items.value = options
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <q-select
    :model-value="modelValue"
    :options="items"
    :loading="loading"
    use-input
    new-value-mode="add-unique"
    spellcheck="false"
    autocapitalize="words"
    autocomplete="off"
    autocorrect="off"
    input-debounce="100"
    @filter="filter"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

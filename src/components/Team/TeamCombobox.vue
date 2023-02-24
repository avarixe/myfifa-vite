<script setup>
  const props = defineProps({
    modelValue: { type: String, default: null },
    defaultItems: { type: Array, default: () => [] }
  })

  defineEmits(['update:modelValue'])

  const items = ref([])
  watch(
    () => props.defaultItems,
    defaultItems => {
      items.value = defaultItems
    },
    { deep: true, immediate: true }
  )

  const timeout = ref(null)
  onBeforeUnmount(() => {
    clearTimeout(timeout.value)
  })

  async function onSearchInputUpdate() {
    clearTimeout(timeout.value)
    if (items.value.includes(search.value)) {
      items.value = []
    } else if (search.value?.length >= 3) {
      timeout.value = setTimeout(() => searchItems(), 300)
    } else {
      items.value = props.defaultItems
    }
  }

  const search = ref('')
  watch(search, onSearchInputUpdate)

  const { data, executeQuery } = useQuery({
    query: gql`
      query fetchTeamOptions($category: OptionCategory!, $search: String) {
        options(category: $category, search: $search)
      }
    `,
    variables: {
      category: 'Team',
      search
    },
    pause: true
  })

  const loading = ref(false)
  const combobox = ref(null)
  async function searchItems() {
    try {
      loading.value = true
      await executeQuery()
      const { options } = data.value
      combobox.value.menu = true
      items.value = options
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <v-combobox
    ref="combobox"
    v-bind="$attrs"
    v-model:search="search"
    :model-value="modelValue"
    :items="items"
    :loading="loading"
    spellcheck="false"
    autocapitalize="words"
    autocomplete="off"
    autocorrect="off"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

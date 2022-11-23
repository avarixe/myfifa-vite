<script>
  export default {
    inheritAttrs: false
  }
</script>

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
  const emit = defineEmits(['update:modelValue'])
  watch(textValue, () => {
    emit('update:modelValue', textValue.value)
    onSearchInputUpdate()
  })

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
    requestPolicy: 'network-only',
    pause: true
  })

  const timeout = ref(null)
  onBeforeUnmount(() => {
    clearTimeout(timeout.value)
  })

  async function onSearchInputUpdate () {
    clearTimeout(timeout.value)
    if (items.value.includes(textValue.value)) {
      items.value = []
    } else if (textValue.value.length >= 3) {
      timeout.value = setTimeout(() => searchItems(), 300)
    } else {
      items.value = props.defaultItems
    }
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

  const listId = `teams-${uuidv4()}`
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="textValue"
    :loading="loading"
    spellcheck="false"
    autocapitalize="words"
    autocomplete="off"
    autocorrect="off"
    :list="listId"
    @update:model-value="textValue = $event"
  />

  <datalist :id="listId">
    <option
      v-for="(item, i) in items"
      :key="i"
      :value="item"
    />
  </datalist>
</template>

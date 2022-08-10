<script setup>
  import * as fragments from '~/fragments'

  const props = defineProps({
    record: { type: Object, required: true },
    store: { type: String, required: true },
    label: { type: String, default: null }
  })

  const storeCamelCase = `${props.store[0].toLowerCase()}${props.store.slice(1)}`

  const { executeMutation: removeRecord } = useMutation(gql`
    mutation remove${props.store}($id: ID!) {
      remove${props.store}(id: $id) {
        ${storeCamelCase} { ...${props.store}Data }
        errors { fullMessages }
      }
    }
    ${fragments[`${storeCamelCase}Fragment`]}
  `)

  const emit = defineEmits()
  async function onClick () {
    if (confirm(`Remove ${props.label}?`)) {
      await removeRecord({ })
      const { data: { [`remove${props.store}`]: { errors, [storeCamelCase]: record} } } =
        await removeRecord({ id: props.record.id })
      if (record) {
        emit('removed')
      } else {
        alert(errors.fullMessages[0])
      }

    }
  }
</script>

<template>
  <v-btn @click="onClick">
    <slot>Remove</slot>
  </v-btn>
</template>

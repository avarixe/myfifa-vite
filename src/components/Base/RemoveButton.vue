<script setup>
  import * as fragments from '~/fragments'

  const props = defineProps({
    record: { type: Object, required: true },
    store: { type: String, required: true },
    label: { type: String, default: null },
    icon: { type: String, default: null }
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

  const emit = defineEmits(['removed'])
  async function onClick () {
    if (confirm(`Remove ${props.label}?`)) {
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
  <q-btn
    v-if="icon"
    :icon="icon"
    flat
    @click="onClick"
  />
  <q-btn
    v-else
    @click="onClick"
  >
    <slot>Remove</slot>
  </q-btn>
</template>

<script setup>
  import * as fragments from '~/fragments'

  const props = defineProps({
    record: { type: Object, required: true },
    store: { type: String, required: true },
    label: { type: String, default: null },
    icon: { type: String, default: null }
  })

  const storeCamelCase = `${props.store[0].toLowerCase()}${props.store.slice(
    1
  )}`

  const emit = defineEmits(['removed'])
  const { submitForm, formIsLoading } = useForm({
    mutation: gql`
      mutation remove${props.store}($id: ID!) {
        remove${props.store}(id: $id) {
          ${storeCamelCase} { ...${props.store}Data }
        }
      }
      ${fragments[`${storeCamelCase}Fragment`]}
    `,
    variables: () => ({ id: props.record.id }),
    onSuccess() {
      emit('removed')
    }
  })

  async function onClick() {
    if (confirm(`Remove ${props.label}?`)) {
      submitForm()
    }
  }
</script>

<template>
  <v-btn
    v-if="icon"
    :icon="icon"
    :loading="formIsLoading"
    variant="text"
    @click="onClick"
  />
  <v-btn v-else :loading="formIsLoading" @click="onClick">
    <slot>Remove</slot>
  </v-btn>
</template>

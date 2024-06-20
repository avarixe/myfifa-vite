<script setup lang="ts">
  import * as fragments from '../../fragments'

  const props = defineProps<{
    record: {
      id: number
    }
    store: string
    label?: string
    icon?: string
  }>()

  const recordType = `${props.store[0].toLowerCase()}${props.store.slice(1)}`

  const emit = defineEmits(['removed'])
  const fragmentKey = `${recordType}Fragment`
  assertType<keyof typeof fragments>(fragmentKey)
  const { submitForm, formIsLoading } = useForm({
    mutation: gql`
      mutation ($id: ID!) {
        remove${props.store}(id: $id) {
          ${recordType} { ...${props.store}Data }
        }
      }
      ${fragments[fragmentKey]}
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

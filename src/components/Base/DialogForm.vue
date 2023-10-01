<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      mutation: ReturnType<typeof gql>
      variables: () => object
      title: string
      titleIcon?: string | null
      maxWidth?: string
      validateOnOpen?: boolean
    }>(),
    {
      title: '',
      titleIcon: null,
      maxWidth: '500px',
      validateOnOpen: false
    }
  )

  const dialog = ref(false)
  const emit = defineEmits(['open', 'close', 'success'])
  watch(dialog, () => {
    emit(dialog.value ? 'open' : 'close')
  })

  const {
    form,
    formKey,
    formIsLoading,
    formIsValid,
    formError,
    submitForm,
    dismissError
  } = useForm({
    mutation: props.mutation,
    variables: props.variables,
    onSuccess(data) {
      dialog.value = false
      emit('success', data)
    },
    broadcastErrors: false
  })

  watch(form, () => {
    if (props.validateOnOpen) {
      form.value?.validate()
    }
  })
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    :max-width="maxWidth"
    activator="parent"
  >
    <v-form
      ref="form"
      :key="formKey"
      v-model="formIsValid"
      @submit.prevent="submitForm"
    >
      <v-card :style="{ maxHeight: '75vh' }">
        <v-toolbar density="compact" :extended="formError.length > 0">
          <slot name="header">
            <v-toolbar-title>
              <v-icon v-if="titleIcon" start>{{ titleIcon }}</v-icon>
              {{ title }}
            </v-toolbar-title>
          </slot>
          <template v-if="formError.length > 0" #extension>
            <v-alert
              type="error"
              :text="formError"
              :rounded="0"
              density="compact"
              closable
              @update:model-value="dismissError"
            />
          </template>
        </v-toolbar>
        <v-divider />
        <v-card-text>
          <v-row dense>
            <slot />
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Cancel"
            size="large"
            :disabled="formIsLoading"
            @click="dialog = false"
          />
          <slot name="additional-actions" />
          <v-btn
            type="submit"
            text="Save"
            :disabled="!formIsValid"
            color="primary"
            size="large"
            :loading="formIsLoading"
          />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

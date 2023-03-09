<script setup>
  const props = defineProps({
    mutation: { type: Object, required: true },
    variables: { type: Function, required: true },
    title: { type: String, default: '' },
    titleIcon: { type: String, default: '' },
    validateOnOpen: { type: Boolean, default: false }
  })

  const menu = ref(false)
  const emit = defineEmits(['open', 'close'])
  watchEffect(() => {
    if (menu.value) {
      emit('open')
    } else {
      emit('close')
    }
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
    onSuccess() {
      menu.value = false
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
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    persistent
    activator="parent"
  >
    <v-form
      ref="form"
      :key="formKey"
      v-model="formIsValid"
      @submit.prevent="submitForm"
    >
      <v-card width="400px">
        <v-toolbar dense :extended="formError.length > 0">
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
        <v-card-text :style="{ maxHeight: '50vh', overflowY: 'auto' }">
          <v-container>
            <v-row dense>
              <slot name="form" />
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn size="large" :disabled="formIsLoading" @click="menu = false">
            Cancel
          </v-btn>
          <slot name="additional-actions" />
          <v-btn
            type="submit"
            :disabled="!formIsValid"
            color="primary"
            size="large"
            :loading="formIsLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-menu>
</template>

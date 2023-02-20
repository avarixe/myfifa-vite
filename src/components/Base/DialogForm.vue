<script setup>
  const props = defineProps({
    submit: { type: Function, required: true },
    title: { type: String, default: '' },
    titleIcon: { type: String, default: '' },
    fullWidth: { type: Boolean, default: false },
    validateOnOpen: { type: Boolean, default: false }
  })

  const dialog = ref(false)
  const emit = defineEmits(['open', 'close'])
  watchEffect(() => {
    if (dialog.value) {
      emit('open')
    } else {
      emit('close')
    }
  })

  const { form, formKey, formIsLoading, formIsValid, submitForm } = useForm({
    onSubmit: props.submit,
    onSuccess: () => {
      dialog.value = false
    }
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
    :max-width="fullWidth ? '' : '500px'"
    activator="parent"
  >
    <v-card :style="{ maxHeight: '75vh' }">
      <v-toolbar dense>
        <slot name="header">
          <v-toolbar-title>
            <v-icon v-if="titleIcon" start>{{ titleIcon }}</v-icon>
            {{ title }}
          </v-toolbar-title>
        </slot>
      </v-toolbar>
      <v-divider />
      <v-card-text>
        <v-form
          ref="form"
          :key="formKey"
          v-model="formIsValid"
          @submit.prevent="submitForm"
        >
          <v-container>
            <v-row dense>
              <slot name="form" />
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn size="large" :disabled="formIsLoading" @click="dialog = false">
          Cancel
        </v-btn>
        <slot name="additional-actions" />
        <v-btn
          :disabled="!formIsValid"
          color="primary"
          size="large"
          :loading="formIsLoading"
          @click="submitForm"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  defineProps({
    submit: { type: Function, required: true },
    title: { type: String, default: '' },
    titleIcon: { type: String, default: '' },
    fullWidth: { type: Boolean, default: false }
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
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    :max-width="fullWidth ? '' : '500px'"
    activator="parent"
  >
    <base-form
      :submit="submit"
      @submitted="dialog = false"
    >
      <template v-slot="{ loading, valid }">
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
            <v-container>
              <v-row dense>
                <slot name="form" />
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              size="large"
              :disabled="loading"
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <slot name="additional-actions" />
            <v-btn
              type="submit"
              :disabled="!valid"
              color="primary"
              size="large"
              :loading="loading"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </base-form>
  </v-dialog>
</template>

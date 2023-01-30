<script setup>
  const props = defineProps({
    modelValue: { type: Boolean, default: false },
    submit: { type: Function, required: true },
    title: { type: String, default: '' },
    titleIcon: { type: String, default: '' },
    fullWidth: { type: Boolean, default: false }
  })

  const emit = defineEmits(['open', 'close'])
  watchEffect(() => {
    if (props.modelValue) {
      emit('open')
    } else {
      emit('close')
    }
  })
</script>

<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
   <q-card :style="{ maxHeight: '75vh', width: fullWidth ? '100%' : '500px' }">
      <base-form
        :submit="submit"
        @submitted="$emit('update:modelValue', false)"
      >
        <template v-slot="{ loading, valid }">
          <q-toolbar class="text-h5">
            <slot name="header">
              <q-icon v-if="titleIcon" :name="titleIcon" />
              {{ title }}
            </slot>
          </q-toolbar>
          <q-separator />
          <q-card-section>
            <div class="row">
              <slot name="form" />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-space />
            <q-btn
              size="large"
              :disable="loading"
              flat
              label="Cancel"
              @click="$emit('update:modelValue', false)"
            />
            <slot name="additional-actions" />
            <q-btn
              type="submit"
              :disable="!valid"
              color="primary"
              size="large"
              flat
              :loading="loading"
              label="Save"
            />
          </q-card-actions>
        </template>
      </base-form>
    </q-card>
  </q-dialog>
</template>

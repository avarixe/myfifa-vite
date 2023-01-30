<script setup>
import { formatDate } from '../../helpers/formatters';

  const props = defineProps({
    modelValue: { type: String, default: null }
  })

  const humanizedValue = computed(() => {
    if (props.modelValue) {
      return formatDate(props.modelValue)
    } else {
      return null
    }
  })
</script>

<template>
  <q-input :model-value="humanizedValue">
    <q-popup-proxy transition-show="jump-down" transition-hide="jump-up">
      <q-date
        mask="YYYY-MM-DD"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
      >
        <div class="row items-center justify-end">
          <q-btn v-close-popup label="Close" color="primary" flat />
        </div>
      </q-date>
    </q-popup-proxy>
  </q-input>
</template>

<script setup lang="ts">
  const props = defineProps<{ modelValue: { [key: string]: number | null } }>()
  const emit = defineEmits(['update:modelValue'])

  function togglePos(pos: string) {
    switch (props.modelValue[pos]) {
      case 1:
        emit('update:modelValue', { ...props.modelValue, [pos]: 2 })
        break
      case 2:
        emit('update:modelValue', { ...props.modelValue, [pos]: null })
        break
      default:
        emit('update:modelValue', { ...props.modelValue, [pos]: 1 })
    }
  }

  function cellColor(_pos: string, cell: { value: number | null }) {
    switch (cell.value) {
      case 1:
        return 'green-darken-2'
      case 2:
        return 'light-green-lighten-2'
      default:
        return 'rgba(0, 0, 0, 0.4)'
    }
  }
</script>

<template>
  <coverage-grid :coverage-data="modelValue" :cell-color="cellColor">
    <template #filled-pos="{ pos }">
      <v-btn
        :text="pos"
        size="small"
        variant="text"
        block
        class="rounded-0"
        @click="togglePos(pos)"
      />
    </template>
  </coverage-grid>
</template>

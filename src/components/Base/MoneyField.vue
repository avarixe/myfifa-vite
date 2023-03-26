<script setup lang="ts">
  import { useCurrencyInput } from 'vue-currency-input'

  defineProps({
    modelValue: { type: [String, Number], default: null }
  })

  const { inputRef, formattedValue } = useCurrencyInput({
    currency: 'USD',
    locale: 'en',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    currencyDisplay: 'hidden',
    precision: 0,
    hideGroupingSeparatorOnFocus: false,
    useGrouping: true
  })

  const { team } = useTeam()
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    ref="inputRef"
    v-model="formattedValue"
    :prefix="team.currency"
  />
</template>

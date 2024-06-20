<script setup lang="ts">
  import { CurrencyDisplay, useCurrencyInput } from 'vue-currency-input'

  defineProps<{ modelValue?: string | number | null }>()

  const { inputRef, formattedValue } = useCurrencyInput({
    currency: 'USD',
    locale: 'en',
    currencyDisplay: CurrencyDisplay.hidden,
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

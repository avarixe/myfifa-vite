<script setup lang="ts">
  import { Cap, Match } from '~/models'

  defineProps<{
    cap: Cap
    match: Match
    readonly?: boolean
  }>()
</script>

<template>
  <div :class="`pa-2 elevation-${readonly ? 0 : 5} rounded-lg w-100`">
    <div class="font-weight-bold">{{ cap.pos }}</div>
    <scroll-text
      :text="cap.player.name"
      :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
    />
    <cap-rating :cap="cap" :readonly="readonly" />
    <cap-events :cap="cap" :match="match" />
    <div v-if="!readonly" class="hidden-sm-and-down">
      <v-divider class="my-2 mx-n2" />
      <cap-event-actions :cap="cap" :match="match" />
    </div>
  </div>
</template>

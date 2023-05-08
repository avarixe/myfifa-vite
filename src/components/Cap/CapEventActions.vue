<script setup lang="ts">
  import { Cap, Match } from '~/models'

  defineProps<{
    cap: Cap
    match: Match
  }>()
</script>

<template>
  <div
    class="d-flex justify-space-around align-center overflow-visible"
    :style="{ overflow: 'auto' }"
  >
    <v-btn size="x-small" icon variant="text" :disabled="cap.subbedOut">
      <v-icon>mdi-account</v-icon>
      <cap-event-menu :cap="cap" :match="match">
        <template #default="{ close }">
          <cap-editor :cap="cap" :match="match" @submitted="close" />
        </template>
      </cap-event-menu>
    </v-btn>
    <v-btn size="x-small" icon variant="text" :disabled="cap.subbedOut">
      <v-icon>mdi-soccer</v-icon>
      <cap-event-menu :cap="cap" :match="match">
        <template #default="{ close }">
          <cap-goal-form :cap="cap" :match="match" @submitted="close" />
        </template>
      </cap-event-menu>
    </v-btn>
    <v-btn size="x-small" icon variant="text" :disabled="cap.subbedOut">
      <v-icon>mdi-repeat</v-icon>
      <cap-event-menu :cap="cap" :match="match">
        <template #default="{ close }">
          <cap-substitution-form :cap="cap" :match="match" @submitted="close" />
        </template>
      </cap-event-menu>
    </v-btn>
    <v-btn size="x-small" icon variant="text" :disabled="cap.subbedOut">
      <v-icon>mdi-book</v-icon>
      <cap-event-menu :cap="cap" :match="match">
        <template #default="{ close }">
          <cap-booking-form :cap="cap" :match="match" @submitted="close" />
        </template>
      </cap-event-menu>
    </v-btn>
  </div>
</template>

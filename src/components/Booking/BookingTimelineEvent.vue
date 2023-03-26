<script setup lang="ts">
  withDefaults(
    defineProps<{
      match: MatchRecord
      event: BookingRecord
      readonly: boolean
    }>(),
    { readonly: false }
  )
</script>

<template>
  <match-timeline-event :match="match" :event="event" :readonly="readonly">
    <v-icon
      :color="event.redCard ? 'red' : 'amber'"
      size="small"
      start
      icon="mdi-book"
    />
    {{ event.playerName }}
  </match-timeline-event>
</template>

<script setup lang="ts">
  defineProps({
    match: { type: Object, required: true },
    event: { type: Object, required: true },
    readonly: { type: Boolean, default: false }
  })
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

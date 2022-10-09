<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    event: { type: Object, required: true }
  })
</script>

<template>
  <match-timeline-event :match="match" :event="event">
    <v-icon
      :color="event.redCard ? 'red' : 'amber'"
      size="small"
      start
      icon="mdi-book"
    />
    {{ event.playerName }}
  </match-timeline-event>
</template>

<script setup lang="ts">
  import { Match, Booking } from '~/models'

  const props = defineProps<{
    match: Match
    event: Booking
    readonly?: boolean
  }>()
</script>

<template>
  <match-timeline-event
    :match="match"
    :event="event"
    :readonly="props.readonly"
  >
    <v-icon
      :color="event.redCard ? 'red' : 'amber'"
      size="small"
      start
      icon="mdi-book"
    />
    {{ event.playerName }}
  </match-timeline-event>
</template>

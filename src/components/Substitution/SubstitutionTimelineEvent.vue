<script setup lang="ts">
  defineProps<{
    match: MatchRecord
    event: SubstitutionRecord
    readonly?: boolean
  }>()
</script>

<template>
  <match-timeline-event :match="match" :event="event" :readonly="readonly">
    <div>
      <v-icon
        :color="event.injury ? 'pink' : 'orange'"
        size="small"
        start
        :icon="`mdi-${event.injury ? 'ambulance' : 'subdirectory-arrow-left'}`"
      />
      {{ event.playerName }}
    </div>
    <div>
      <v-icon
        color="green"
        size="small"
        start
        icon="mdi-subdirectory-arrow-right"
      />
      {{ event.replacedBy }}
    </div>
  </match-timeline-event>
</template>

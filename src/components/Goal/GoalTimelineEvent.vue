<script setup lang="ts">
  defineProps({
    match: { type: Object, required: true },
    event: { type: Object, required: true },
    readonly: { type: Boolean, default: false }
  })
</script>

<template>
  <match-timeline-event :match="match" :event="event" :readonly="readonly">
    <div>
      <v-icon
        :color="event.ownGoal ? 'blue-grey' : 'blue'"
        size="small"
        start
        icon="mdi-soccer"
      />
      {{ event.playerName }}
      <span v-if="event.penalty">(P)</span>
      <span v-else-if="event.ownGoal">(OG)</span>
    </div>
    <div v-if="event.assistedBy">
      <v-icon
        color="light-blue accent-1"
        size="small"
        start
        icon="mdi-human-greeting"
      />
      {{ event.assistedBy }}
    </div>
  </match-timeline-event>
</template>

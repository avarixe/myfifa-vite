<script setup lang="ts">
  import { Goal, Match } from '~/models'

  const props = defineProps<{
    match: Match
    event: Goal
    readonly?: boolean
  }>()
</script>

<template>
  <match-timeline-event
    :match="match"
    :event="event"
    :readonly="props.readonly"
  >
    <div>
      <v-icon
        :color="event.ownGoal ? 'red' : 'blue'"
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

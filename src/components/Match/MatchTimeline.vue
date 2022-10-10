<script setup>
  import BookingTimelineEvent from '~/components/Booking/BookingTimelineEvent.vue'
  import GoalTimelineEvent from '~/components/Goal/GoalTimelineEvent.vue'
  import SubstitutionTimelineEvent from '~/components/Substitution/SubstitutionTimelineEvent.vue'

  const eventComponent = {
    Booking: BookingTimelineEvent,
    Goal: GoalTimelineEvent,
    Substitution: SubstitutionTimelineEvent
  }

  const props = defineProps({
    match: { type: Object, required: true }
  })

  const events = computed(() => orderBy([
    ...props.match.bookings,
    ...props.match.substitutions,
    ...props.match.goals
  ], ['minute', 'createdAt'], ['asc', 'asc']))

  const { mdAndUp } = useDisplay()
</script>

<template>
  <v-timeline align="start" side="end">
    <v-timeline-item v-if="mdAndUp" dot-color="primary" icon="mdi-shield-half-full">
      <template #opposite>
        <div class="text-h4 text-teal">{{ match.home }}</div>
      </template>
      <div class="text-h4 text-blue-grey">{{ match.away }}</div>
    </v-timeline-item>
    <template v-for="event in events" :key="`${event.type}-${event.id}`">
      <component
        :is="eventComponent[event.timelineType]"
        :event="event"
        :match="match"
      />
    </template>
    <penalty-shootout-timeline-event
      v-if="match.penaltyShootout"
      :match="match"
      :event="match.penaltyShootout"
    />
    <v-timeline-item
      v-else-if="events.length === 0"
      dot-color="grey"
      icon="mdi-timer"
    >
      <div class="mt-2">No Match Events</div>
    </v-timeline-item>
  </v-timeline>
</template>

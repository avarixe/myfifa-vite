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

  const events = computed(() =>
    orderBy(
      [
        ...props.match.bookings,
        ...props.match.substitutions,
        ...props.match.goals
      ],
      ['minute', 'createdAt'],
      ['asc', 'asc']
    )
  )

  const { mdAndUp } = useDisplay()
</script>

<template>
  <v-timeline align="start" side="end">
    <v-timeline-item
      v-if="mdAndUp"
      dot-color="info"
      icon="mdi-shield-half-full"
    >
      <template #opposite>
        <div class="text-h4 text-teal">{{ match.home }}</div>
      </template>
      <div class="text-h4 text-blue-grey">{{ match.away }}</div>
    </v-timeline-item>
    <v-timeline-item icon="mdi-plus" dot-color="primary">
      <template #opposite>
        <v-row v-if="mdAndUp" dense>
          <v-col>
            <v-btn color="blue">
              <v-icon start>mdi-soccer</v-icon>
              Goal
              <goal-form :match="match" />
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="warning">
              <v-icon start>mdi-book</v-icon>
              Booking
              <booking-form :match="match" />
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-row dense>
        <template v-if="!mdAndUp">
          <v-col>
            <v-btn color="blue">
              <v-icon start>mdi-soccer</v-icon>
              Goal
              <goal-form :match="match" />
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="warning">
              <v-icon start>mdi-book</v-icon>
              Booking
              <booking-form :match="match" />
            </v-btn>
          </v-col>
        </template>
        <v-col>
          <v-btn color="success">
            <v-icon start>mdi-repeat</v-icon>
            Substitution
            <substitution-form :match="match" />
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            v-if="!match.penaltyShootout && match.homeScore === match.awayScore"
            color="indigo"
          >
            <v-icon start>mdi-human</v-icon>
            Penalty Shootout
            <penalty-shootout-form :match="match" />
          </v-btn>
        </v-col>
      </v-row>
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

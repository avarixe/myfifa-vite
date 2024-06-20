<script setup lang="ts">
  import { Booking, Goal, Match } from '~/models'

  const props = defineProps<{
    match: Match
    readonly?: boolean
  }>()

  const events = computed(() => {
    const capChanges = Object.entries(
      _groupBy(
        props.match.caps.filter(cap => cap.start > 0),
        'start'
      )
    ).map(([minute, caps]) => ({
      minute,
      type: 'Cap',
      id: caps[0].id,
      createdAt: caps[0].createdAt
    }))
    return _orderBy(
      [...props.match.goals, ...props.match.bookings, ...capChanges],
      ['minute', 'createdAt'],
      ['asc', 'asc']
    )
  })

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
    <v-timeline-item v-if="!props.readonly" icon="mdi-plus" dot-color="primary">
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
      <booking-timeline-event
        v-if="event instanceof Booking"
        :booking="event"
        :match="match"
        :readonly="props.readonly"
      />
      <goal-timeline-event
        v-else-if="event instanceof Goal"
        :goal="event"
        :match="match"
        :readonly="props.readonly"
      />
      <match-formation-timeline-event
        v-else
        :match="match"
        :minute="Number(event.minute)"
        :readonly="props.readonly"
      />
    </template>
    <penalty-shootout-timeline-event
      v-if="match.penaltyShootout"
      :match="match"
      :event="match.penaltyShootout"
      :readonly="props.readonly"
    />
    <v-timeline-item dot-color="grey" icon="mdi-timer">
      <div class="mt-2">End of Match</div>
      <match-extra-time-switch
        v-if="!props.readonly"
        :match="match"
        label="After Extra Time"
        color="primary"
        density="compact"
        hide-details
      />
    </v-timeline-item>
  </v-timeline>
</template>

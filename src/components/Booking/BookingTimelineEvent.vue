<script setup lang="ts">
  import { Match, Booking } from '~/models'

  const props = defineProps<{
    match: Match
    booking: Booking
    readonly?: boolean
  }>()

  const itemColor = computed(() => (props.booking.home ? 'teal' : 'blue-grey'))

  const { mdAndUp } = useDisplay()
  const slotName = computed(() =>
    props.booking.home && mdAndUp.value ? 'opposite' : 'default'
  )
</script>

<template>
  <v-timeline-item :dot-color="itemColor">
    <template #icon>
      <small>{{ booking.minute }}'</small>
    </template>
    <template #[slotName]>
      <div
        v-if="!mdAndUp"
        :class="`font-weight-light text-caption text-truncate mx-1 text-${itemColor} my-0`"
        v-text="booking.home ? match.home : match.away"
      />

      <div>
        <v-icon
          :color="booking.redCard ? 'red' : 'amber'"
          size="small"
          start
          icon="mdi-book"
        />
        {{ booking.playerName }}
      </div>

      <div v-if="!props.readonly">
        <v-btn variant="text" color="warning" size="small">
          Edit
          <booking-form :match="match" :record="booking" />
        </v-btn>
        <remove-button
          :record="booking"
          store="Booking"
          label="Booking"
          variant="text"
          size="small"
        />
      </div>
    </template>
  </v-timeline-item>
</template>

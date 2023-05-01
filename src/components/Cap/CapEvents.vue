<script setup lang="ts">
  const props = defineProps<{
    cap: CapRecord
    match: MatchRecord
  }>()

  const numGoals = computed(
    () =>
      props.match.goals.filter(
        g => g.playerId === props.cap.playerId && !g.ownGoal
      ).length
  )
  const numAssists = computed(
    () =>
      props.match.goals.filter(g => g.assistId === props.cap.playerId).length
  )
  const booking = computed(() => {
    const bookings = props.match.bookings.filter(
      booking => booking.playerId === props.cap.playerId
    )

    if (bookings.some(b => b.redCard)) {
      return 'red'
    } else if (bookings.length > 0) {
      return 'yellow darken-2'
    } else {
      return null
    }
  })
  const injured = computed(() =>
    props.match.substitutions.some(
      s => s.playerId === props.cap.playerId && s.injury
    )
  )
</script>

<template>
  <div>
    <v-badge
      v-if="cap.start > 0"
      location="bottom right"
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="counter font-weight-black">{{ cap.start }}'</div>
      </template>
      <v-icon color="green" size="small" icon="mdi-subdirectory-arrow-right" />
    </v-badge>
    <v-badge
      v-if="numGoals > 0"
      location="bottom right"
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="counter font-weight-black">{{ numGoals }}</div>
      </template>
      <v-icon color="blue" size="small" icon="mdi-soccer" />
    </v-badge>
    <v-badge
      v-if="numAssists > 0"
      location="bottom right"
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="counter font-weight-black">{{ numAssists }}</div>
      </template>
      <v-icon
        color="light-blue accent-1"
        size="small"
        icon="mdi-human-greeting"
      />
    </v-badge>
    <v-icon v-if="booking" :color="booking" size="small" icon="mdi-book" />
    <v-icon v-if="injured" color="pink" size="small" icon="mdi-ambulance" />
    <v-badge
      v-if="cap.subbedOut"
      location="bottom right"
      overlap
      color="transparent"
    >
      <v-icon
        color="orange darken-2"
        size="small"
        icon="mdi-subdirectory-arrow-left"
      />
      <template #badge>
        <div class="counter font-weight-black">{{ cap.stop }}'</div>
      </template>
    </v-badge>
  </div>
</template>

<style scoped lang="scss">
  .counter {
    color: black;

    .v-theme--dark & {
      color: white;
    }
  }
</style>

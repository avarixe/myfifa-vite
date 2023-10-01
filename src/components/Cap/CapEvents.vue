<script setup lang="ts">
  import { Cap, Match } from '~/models'

  const props = defineProps<{
    cap: Cap
    match: Match
  }>()

  const capRepo = useRepo(Cap)
  const allPlayerCaps = computed(
    () =>
      capRepo
        .where('matchId', props.match.id)
        .where('playerId', props.cap.playerId)
        .orderBy('start')
        .get() as Cap[]
  )
  const playerInAt = computed(() => allPlayerCaps.value[0].start)
  const playerOutAt = computed(
    () => allPlayerCaps.value[allPlayerCaps.value.length - 1].stop
  )

  const numGoals = computed(
    () =>
      props.match.goals.filter(
        g => g.playerId === props.cap.playerId && !g.ownGoal
      ).length
  )
  const numOwnGoals = computed(
    () =>
      props.match.goals.filter(
        g => g.playerId === props.cap.playerId && g.ownGoal
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
</script>

<template>
  <div>
    <v-badge
      v-if="playerInAt"
      location="bottom right"
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="text-white font-weight-black">{{ playerInAt }}'</div>
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
        <div class="text-white font-weight-black">{{ numGoals }}</div>
      </template>
      <v-icon color="blue" size="small" icon="mdi-soccer" />
    </v-badge>
    <v-badge
      v-if="numOwnGoals > 0"
      location="bottom right"
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="text-white font-weight-black">{{ numOwnGoals }}</div>
      </template>
      <v-icon color="red-darken-4" size="small" icon="mdi-soccer" />
    </v-badge>
    <v-badge
      v-if="numAssists > 0"
      location="bottom right"
      overlap
      color="transparent"
    >
      <template #badge>
        <div class="text-white font-weight-black">{{ numAssists }}</div>
      </template>
      <v-icon
        color="light-blue accent-1"
        size="small"
        icon="mdi-human-greeting"
      />
    </v-badge>
    <v-icon v-if="booking" :color="booking" size="small" icon="mdi-book" />
    <v-icon v-if="cap.injured" color="pink" size="small" icon="mdi-ambulance" />
    <v-badge
      v-if="playerOutAt < match.endOfMatch"
      location="bottom right"
      overlap
      color="transparent"
    >
      <v-icon
        color="red darken-2"
        size="small"
        icon="mdi-subdirectory-arrow-left"
      />
      <template #badge>
        <div class="text-white font-weight-black">{{ playerOutAt }}'</div>
      </template>
    </v-badge>
  </div>
</template>

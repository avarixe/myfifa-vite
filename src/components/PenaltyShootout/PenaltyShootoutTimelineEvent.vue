<script setup lang="ts">
  import { Match, PenaltyShootout } from '~/models'

  const props = defineProps<{
    match: Match
    event: PenaltyShootout
    readonly?: boolean
  }>()

  const winner = computed(() =>
    props.event.homeScore > props.event.awayScore
      ? props.match.home
      : props.match.away
  )
</script>

<template>
  <v-timeline-item dot-color="indigo">
    <template #icon>
      <small>{{ match.extraTime ? 120 : 90 }}'</small>
    </template>
    <h2 class="font-weight-light my-0">
      <span class="text-caption text-truncate mx-1 text-indigo">
        Penalty Shootout
      </span>
    </h2>

    <div :class="{ 'font-weight-bold': match.home === winner }">
      {{ event.homeScore }} - {{ match.home }}
    </div>
    <div :class="{ 'font-weight-bold': match.away === winner }">
      {{ event.awayScore }} - {{ match.away }}
    </div>

    <div v-if="!props.readonly">
      <v-btn variant="text" color="orange">
        Edit
        <penalty-shootout-form :match="match" />
      </v-btn>
      <remove-button
        :record="event"
        store="PenaltyShootout"
        label="Penalty Shootout"
        variant="text"
      />
    </div>
  </v-timeline-item>
</template>

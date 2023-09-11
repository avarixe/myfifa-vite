<script setup lang="ts">
  import { Match, PenaltyShootout } from '~/models'

  const props = defineProps<{
    match: Match
    event: PenaltyShootout
    readonly?: boolean
  }>()

  const winnerIsHome = computed(
    () => props.event.homeScore > props.event.awayScore
  )

  const winner = computed(() =>
    winnerIsHome.value ? props.match.home : props.match.away
  )

  const { mdAndUp } = useDisplay()
  const slotName = computed(() =>
    winnerIsHome.value && mdAndUp.value ? 'opposite' : 'default'
  )
</script>

<template>
  <v-timeline-item dot-color="indigo">
    <template #icon>
      <small>{{ match.extraTime ? 120 : 90 }}'</small>
    </template>
    <template #[slotName]>
      <h2
        v-if="!mdAndUp"
        class="font-weight-light text-caption text-truncate mx-1 text-indigo my-0"
        v-text="'Penalty Shootout'"
      />

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
    </template>
  </v-timeline-item>
</template>

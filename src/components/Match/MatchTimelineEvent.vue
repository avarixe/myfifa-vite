<script setup lang="ts">
  import { Match, Goal, Booking, Substitution } from '~/models'

  const props = defineProps<{
    match: Match
    event: Goal | Booking | Substitution
    readonly?: boolean
  }>()

  const { team } = useTeam()

  const teamIsHome = computed(() => {
    if (props.event.timelineType === 'Substitution') {
      return team.value.name === props.match.home
    } else {
      return props.event.home
    }
  })

  const itemColor = computed(() => (teamIsHome.value ? 'teal' : 'blue-grey'))

  const { mdAndUp } = useDisplay()
  const slotName = computed(() =>
    teamIsHome.value && mdAndUp.value ? 'opposite' : 'default'
  )
</script>

<template>
  <v-timeline-item :dot-color="itemColor">
    <template #icon>
      <small>{{ event.minute }}'</small>
    </template>
    <template #[slotName]>
      <div
        v-if="!mdAndUp"
        :class="`font-weight-light text-caption text-truncate mx-1 text-${itemColor} my-0`"
        v-text="teamIsHome ? match.home : match.away"
      />

      <slot />

      <div v-if="!props.readonly">
        <v-btn variant="text" color="warning">
          Edit
          <booking-form
            v-if="event.timelineType === 'Booking'"
            :match="match"
            :record="event"
          />
          <goal-form
            v-else-if="event.timelineType === 'Goal'"
            :match="match"
            :record="event"
          />
          <substitution-form
            v-else-if="event.timelineType === 'Substitution'"
            :match="match"
            :record="event"
          />
        </v-btn>
        <remove-button
          :record="event"
          :store="event.timelineType"
          :label="capitalize(event.timelineType)"
          variant="text"
        />
      </div>
    </template>
  </v-timeline-item>
</template>

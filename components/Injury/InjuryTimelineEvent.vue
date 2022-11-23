<script setup>
  import { formatDistance } from 'date-fns'

  const { team } = useTeam()

  const props = defineProps({
    player: { type: Object, required: true },
    event: { type: Object, required: true }
  })

  const duration = computed(() =>
    formatDistance(
      parseISO(props.event.endedOn),
      parseISO(props.event.startedOn)
    )
  )
</script>

<template>
  <player-timeline-event
    :player="player"
    :event="event"
    :title="`${event.description} Injury`"
    icon="mdi-ambulance"
    color="pink"
  >
    <template #heading>
      {{ formatDate(event.startedOn) }} -
      <span v-if="event.endedOn < team.currentlyOn">
        {{ formatDate(event.endedOn) }}
      </span>
      <span v-else>Present</span>
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">Injured for {{ duration }}</td>
      </tr>
    </template>
  </player-timeline-event>
</template>

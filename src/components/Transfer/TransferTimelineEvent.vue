<script setup lang="ts">
  const { team } = useTeam()

  const props = defineProps<{
    player: PlayerRecord
    event: TransferRecord
  }>()

  const transferOut = computed(() => props.event.origin === team.value.name)
  const title = computed(() =>
    transferOut.value
      ? `Transfer to ${props.event.destination}`
      : `Transfer from ${props.event.origin}`
  )
  const icon = computed(
    () => `mdi-airplane-${transferOut.value ? 'takeoff' : 'landing'}`
  )
  const color = computed(() => (transferOut.value ? 'red' : 'green'))
</script>

<template>
  <player-timeline-event
    :player="player"
    :event="event"
    :title="title"
    :icon="icon"
    :color="color"
  >
    <template #heading>
      <v-chip
        v-if="!event.signedOn"
        color="error"
        size="small"
        label
        variant="outlined"
      >
        <v-icon start size="small">mdi-pencil-off</v-icon>
        UNSIGNED
      </v-chip>
      {{ formatDate(event.movedOn) }}
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Origin</td>
        <td class="pl-1">{{ event.origin }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Destination</td>
        <td class="pl-1">{{ event.destination }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Transfer Fee</td>
        <td class="pl-1">{{ formatMoney(event.fee, team.currency) }}</td>
      </tr>
      <tr v-if="event.tradedPlayer">
        <td class="font-weight-bold">Traded Player</td>
        <td class="pl-1">{{ event.tradedPlayer }}</td>
      </tr>
      <tr v-if="event.addonClause">
        <td class="font-weight-bold">Add-On Clause</td>
        <td class="pl-1">{{ event.addonClause }}%</td>
      </tr>
    </template>
  </player-timeline-event>
</template>

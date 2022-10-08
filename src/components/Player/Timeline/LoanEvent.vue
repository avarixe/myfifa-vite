<script setup>
  import { formatDistance } from 'date-fns'

  const { team } = useTeam()

  const props = defineProps({
    player: { type: Object, required: true },
    event: { type: Object, required: true }
  })

  const title = computed(() =>
    team.value.name === props.event.origin
      ? `Loan at ${props.event.destination}`
      : `Loan from ${props.event.origin}`
  )
  const timeBeforeDeparture = computed(() =>
    formatDistance(
      parseISO(props.event.startedOn),
      parseISO(team.value.currentlyOn)
    )
  )
  const duration = computed(() =>
    formatDistance(
      parseISO(props.event.endedOn),
      parseISO(props.event.startedOn)
    )
  )
  const buyOptionAvailable = computed(() =>
    props.event.signedOn &&
      props.event.endedOn > team.value.currentlyOn &&
      (props.event.transferFee || props.event.addonClause)
  )
</script>

<template>
  <player-event
    :player="player"
    :event="event"
    :title="title"
    icon="mdi-transit-transfer"
    color="deep-orange"
  >
    <template #heading>
      <v-chip
        v-if="!event.signedOn"
        color="error"
        small
        label
        outlined
      >
        <v-icon left small>mdi-pencil-off</v-icon>
        UNSIGNED
      </v-chip>
      <template v-if="event.startedOn > team.currentlyOn">
        Scheduled on {{ formatDate(event.startedOn) }}
      </template>
      <template v-else>
        {{ formatDate(event.startedOn) }} -
        <span v-if="event.endedOn < team.currentlyOn">
          {{ formatDate(event.endedOn) }}
        </span>
        <span v-else>Present</span>
      </template>
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
      <tr v-if="event.wagePercentage">
        <td class="font-weight-bold">Wage Percentage</td>
        <td class="pl-1">{{ event.wagePercentage }}%</td>
      </tr>
      <tr v-if="event.startedOn > team.currentlyOn">
        <td class="font-weight-bold">Departs In</td>
        <td class="pl-1">{{ timeBeforeDeparture }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold">Duration</td>
        <td class="pl-1">{{ duration }}</td>
      </tr>
      <template v-if="event.transferFee || event.addonClause">
        <tr>
          <td colspan="2" class="text-subtitle-1">Loan-to-Buy Option</td>
        </tr>
        <tr v-if="event.transferFee">
          <td class="font-weight-bold">Transfer Fee</td>
          <td class="pl-1">{{ formatMoney(event.transferFee, team.currency) }}</td>
        </tr>
        <tr v-if="event.addonClause">
          <td class="font-weight-bold">Add-On Clause</td>
          <td class="pl-1">{{ event.addonClause }}%</td>
        </tr>
      </template>
    </template>
    <template #additional-actions>
      <v-btn
        v-if="buyOptionAvailable"
        text
        small
        :color="event.origin === team.name ? 'red' : 'green'"
      >
        Activate Buy Option
      </v-btn>
    </template>
  </player-event>
</template>

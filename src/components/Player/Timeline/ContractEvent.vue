<script setup>
  const { team } = useTeam()

  defineProps({
    player: { type: Object, required: true },
    event: { type: Object, required: true }
  })
</script>

<template>
  <player-event
    :player="player"
    :event="event"
    title="Contract"
    icon="mdi-file-document"
    color="blue"
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
      {{ formatDate(event.startedOn) }} - {{ formatDate(event.endedOn) }}
      <span
        v-if="event.conclusion && event.endedOn <= team.currentlyOn"
        class="pl-1"
      >
        ({{ event.conclusion }})
      </span>
    </template>
    <template #details>
      <tr>
        <td class="font-weight-bold">Wage</td>
        <td class="pl-1">
          {{ formatMoney(event.wage, team.currency) }}
        </td>
      </tr>
      <tr>
        <td class="font-weight-bold">Signing Bonus</td>
        <td class="pl-1">
          {{ formatMoney(event.signingBonus, team.currency) }}
        </td>
      </tr>
      <tr v-if="event.performanceBonus">
        <td class="font-weight-bold">Performance Bonus</td>
        <td class="pl-1">
          {{ formatMoney(event.performanceBonus, team.currency) }}
          if {{ event.bonusReq }} {{ event.bonusReqType }}
        </td>
      </tr>
      <tr v-if="event.releaseClause">
        <td class="font-weight-bold">Release Clause</td>
        <td class="pl-1">
          {{ formatMoney(event.releaseClause, team.currency) }}
        </td>
      </tr>
    </template>
  </player-event>
</template>

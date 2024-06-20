<script setup lang="ts">
  import { Contract, Injury, Loan, Player, Transfer } from '~/models'

  const props = defineProps<{ player: Player }>()

  const events = computed(() =>
    _orderBy(
      [
        ...props.player.contracts,
        ...props.player.injuries,
        ...props.player.loans,
        ...props.player.transfers
      ],
      ['startedOn', 'createdAt'],
      ['desc', 'desc']
    )
  )
</script>

<template>
  <v-card flat>
    <v-card-text>
      <v-timeline align="start" side="end">
        <v-timeline-item icon="mdi-plus" dot-color="primary">
          <v-row dense>
            <v-col cols="6" md="4">
              <v-btn color="blue">
                <v-icon start>mdi-file-document</v-icon>
                Contract
                <contract-form :player="player" />
              </v-btn>
            </v-col>
            <v-col cols="6" md="4">
              <v-btn color="pink">
                <v-icon start>mdi-ambulance</v-icon>
                Injury
                <injury-form :player="player" />
              </v-btn>
            </v-col>
            <v-col cols="6" md="4">
              <v-btn color="deep-orange">
                <v-icon start>mdi-transit-transfer</v-icon>
                Loan
                <loan-form :player="player" />
              </v-btn>
            </v-col>
            <v-col cols="6" md="4">
              <v-btn :color="player.isActive ? 'red' : 'green'">
                <v-icon start>mdi-airplane</v-icon>
                Transfer
                <transfer-form :player="player" />
              </v-btn>
            </v-col>
            <v-col cols="6" md="4">
              <v-btn color="grey-darken-2">
                <v-icon start>mdi-human-greeting</v-icon>
                Retire
                <player-retire-button :player="player" />
              </v-btn>
            </v-col>
            <v-col cols="6" md="4">
              <v-btn color="red-darken-4">
                <v-icon start>mdi-text-box-remove</v-icon>
                Release
                <player-release-button :player="player" />
              </v-btn>
            </v-col>
          </v-row>
        </v-timeline-item>
        <template v-if="events.length > 0">
          <template v-for="event in events" :key="`${event.type}-${event.id}`">
            <contract-timeline-event
              v-if="event instanceof Contract"
              :player="player"
              :event="event"
            />
            <injury-timeline-event
              v-else-if="event instanceof Injury"
              :player="player"
              :event="event"
            />
            <loan-timeline-event
              v-else-if="event instanceof Loan"
              :player="player"
              :event="event"
            />
            <transfer-timeline-event
              v-else-if="event instanceof Transfer"
              :player="player"
              :event="event"
            />
          </template>
        </template>
        <v-timeline-item v-else dot-color="grey" icon="mdi-calendar" fill-dot>
          <div class="mt-2">No Player Events</div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

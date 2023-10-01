<script setup lang="ts">
  import { Player, Contract, Injury, Loan, Transfer } from '~/models'

  const props = defineProps<{
    player: Player
    event: Contract | Injury | Loan | Transfer
    title: string
    icon: string
    color: string
  }>()

  const timelineType = computed(() => {
    if (props.event instanceof Contract) {
      return 'Contract'
    } else if (props.event instanceof Injury) {
      return 'Injury'
    } else if (props.event instanceof Loan) {
      return 'Loan'
    } else if (props.event instanceof Transfer) {
      return 'Transfer'
    } else {
      return ''
    }
  })
</script>

<template>
  <v-timeline-item :icon="icon" :dot-color="color">
    <v-card density="compact" flat>
      <v-card-title class="py-0">
        <div :class="`text-${color}`">
          <span class="text-h6 font-weight-bold">{{ title }}</span>
          <h4 class="text-body-2 font-weight-light mb-3">
            <slot name="heading" />
          </h4>
        </div>
      </v-card-title>
      <v-card-text class="py-0">
        <table>
          <tbody>
            <slot name="details" />
          </tbody>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" size="small" color="orange">
          Edit
          <contract-form
            v-if="event instanceof Contract"
            :player="player"
            :record="event"
          />
          <injury-form
            v-else-if="event instanceof Injury"
            :player="player"
            :record="event"
          />
          <loan-form
            v-else-if="event instanceof Loan"
            :player="player"
            :record="event"
          />
          <transfer-form
            v-else-if="event instanceof Transfer"
            :player="player"
            :record="event"
          />
        </v-btn>
        <slot name="additional-actions" />
        <remove-button
          :record="event"
          :store="timelineType"
          :label="timelineType"
        />
      </v-card-actions>
    </v-card>
  </v-timeline-item>
</template>

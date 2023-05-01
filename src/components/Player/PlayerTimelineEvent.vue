<script setup lang="ts">
  import ContractForm from '~/components/Contract/ContractForm.vue'
  import InjuryForm from '~/components/Injury/InjuryForm.vue'
  import LoanForm from '~/components/Loan/LoanForm.vue'
  import TransferForm from '~/components/Transfer/TransferForm.vue'

  const eventForm = {
    Contract: ContractForm,
    Injury: InjuryForm,
    Loan: LoanForm,
    Transfer: TransferForm
  }

  defineProps<{
    player: PlayerRecord
    event: {
      id: number
      timelineType: 'Contract' | 'Injury' | 'Loan' | 'Transfer'
    }
    title: string
    icon: string
    color: string
  }>()
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
          <component
            :is="eventForm[event.timelineType]"
            :player="player"
            :record="event"
          />
        </v-btn>
        <slot name="additional-actions" />
        <remove-button
          :record="event"
          :store="event.timelineType"
          :label="event.timelineType"
        />
      </v-card-actions>
    </v-card>
  </v-timeline-item>
</template>

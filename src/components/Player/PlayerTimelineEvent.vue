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

  defineProps({
    player: { type: Object, required: true },
    event: { type: Object, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true }
  })
</script>

<template>
  <v-timeline-item :icon="icon" :dot-color="color">
    <v-card dense flat>
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
        <v-btn text small color="orange">
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

<script setup lang="ts">
  import { subDays } from 'date-fns'

  const props = defineProps({
    player: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const { team, endOfCurrentSeason } = useTeam()
  const attributes = reactive({
    signedOn: null,
    startedOn: null,
    endedOn: null,
    origin: null,
    destination: null,
    wagePercentage: null,
    transferFee: null,
    addonClause: 0
  })
  function onOpen() {
    attributes.signedOn = props.record?.signedOn
    attributes.startedOn = props.record?.startedOn ?? team.value.currentlyOn
    attributes.endedOn =
      props.record?.endedOn ??
      format(subDays(parseISO(endOfCurrentSeason.value), 1), 'yyyy-MM-dd')
    attributes.origin = props.record?.origin
    attributes.destination = props.record?.destination
    attributes.wagePercentage = props.record?.wagePercentage
    attributes.transferFee = props.record?.transferFee
    attributes.addonClause = props.record?.addonClause
    if (!props.record) {
      if (loanOut.value) {
        attributes.origin = team.value.name
      } else {
        attributes.destination = team.value.name
      }
    }
  }

  const rulesFor = {
    origin: [isRequired('Origin')],
    destination: [isRequired('Destination')],
    wagePercentage: [
      isNumber('Wage Percentage'),
      inRange('Wage Percentage', [0, 100])
    ],
    addonClause: [isNumber('Add-On Clause'), inRange('Add-On Clause', [0, 25])]
  }

  const loanOut = computed(() =>
    props.record
      ? team.value.name === props.record.origin
      : props.player.status?.length > 0
  )
  const title = computed(() =>
    props.record ? 'Update Loan' : 'Record New Loan'
  )

  watchEffect(() => {
    if (!attributes.addonClause) {
      attributes.addonClause = 0
    }
  })

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: LoanAttributes!) {
          updateLoan(id: $id, attributes: $attributes) {
            loan {
              ...LoanData
            }
          }
        }
        ${loanFragment}
      `
    : gql`
        mutation ($playerId: ID!, $attributes: LoanAttributes!) {
          addLoan(playerId: $playerId, attributes: $attributes) {
            loan {
              ...LoanData
            }
          }
        }
        ${loanFragment}
      `
  function variables() {
    return props.record
      ? { id: props.record.id, attributes }
      : { playerId: props.player.id, attributes }
  }
</script>

<template>
  <dialog-form
    :title="title"
    :validate-on-open="!!record"
    :mutation="mutation"
    :variables="variables"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="12">
        <date-field
          v-model="attributes.signedOn"
          label="Signed Date"
          prepend-icon="mdi-calendar-edit"
          :prefill="team.currentlyOn"
          clearable
        />
      </v-col>
      <v-col cols="12">
        <date-field
          v-model="attributes.startedOn"
          label="Start Date"
          prepend-icon="mdi-calendar-today"
          :min="attributes.signedOn"
          :max="attributes.endedOn"
          :prefill="team.currentlyOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <date-field
          v-model="attributes.endedOn"
          label="Return Date"
          prepend-icon="mdi-calendar"
          :min="attributes.startedOn"
          :prefill="team.currentlyOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.origin"
          label="Origin"
          prepend-icon="mdi-airplane-takeoff"
          :rules="loanOut ? [] : rulesFor.origin"
          :disabled="loanOut"
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="loanOut ? rulesFor.destination : []"
          :disabled="!loanOut"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.wagePercentage"
          label="Wage Percentage (%)"
          :rules="attributes.wagePercentage ? rulesFor.wagePercentage : []"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <money-field v-model="attributes.transferFee" label="Transfer Fee" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.addonClause"
          label="Add-On Clause (%)"
          :rules="attributes.addonClause ? rulesFor.addonClause : []"
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

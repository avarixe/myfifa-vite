<script setup lang="ts">
  import { subDays } from 'date-fns'

  import { Loan, Player } from '~/models'

  const props = defineProps<{
    player: Player
    record?: Loan
  }>()

  interface LoanAttributes {
    signedOn?: string
    startedOn?: string
    endedOn?: string
    origin?: string
    destination?: string
    wagePercentage?: number | null
    transferFee?: number | null
    addonClause?: number | null
  }

  const { team, endOfCurrentSeason } = useTeam()
  const attributes: LoanAttributes = reactive({})
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

  const loanOut = computed(() =>
    props.record
      ? team.value.name === props.record.origin
      : (props.player?.status ?? '').length > 0
  )
  const title = computed(() => `${props.record ? 'Update' : 'Record New'} Loan`)

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
        :rules="loanOut ? [] : [isRequired('Origin')]"
        :disabled="loanOut"
      />
    </v-col>
    <v-col cols="12">
      <team-combobox
        v-model="attributes.destination"
        label="Destination"
        prepend-icon="mdi-airplane-landing"
        :rules="loanOut ? [isRequired('Destination')] : []"
        :disabled="!loanOut"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model.number="attributes.wagePercentage"
        label="Wage Percentage (%)"
        :rules="
          attributes.wagePercentage
            ? [
                isNumber('Wage Percentage'),
                inRange('Wage Percentage', [0, 100])
              ]
            : []
        "
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
        :rules="
          attributes.addonClause
            ? [isNumber('Add-On Clause'), inRange('Add-On Clause', [0, 25])]
            : []
        "
        inputmode="numeric"
      />
    </v-col>
  </dialog-form>
</template>

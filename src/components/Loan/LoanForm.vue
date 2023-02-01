<script setup>
  import { subDays } from 'date-fns'

  const props = defineProps({
    player: { type: Object, required: true },
    record: { type: Object, default: null }
  })

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

  const rulesFor = {
    origin: [isRequired('Origin')],
    destination: [isRequired('Destination')],
    wagePercentage: [
      isNumber('Wage Percentage'),
      inRange('Wage Percentage', [0, 100])
    ],
    addonClause: [
      isNumber('Add-On Clause'),
      inRange('Add-On Clause', [0, 25])
    ]
  }

  const { team, endOfCurrentSeason } = useTeam()
  const loanOut = computed(() =>
    props.record
      ? team.value.name === props.record.origin
      : props.player.status?.length > 0
  )
  const title = computed(() => props.record ? 'Update Loan' : 'Record New Loan')

  function onOpen () {
    if (props.record) {
      Object.assign(attributes, pick(props.record, [
        'signedOn',
        'startedOn',
        'endedOn',
        'origin',
        'destination',
        'wagePercentage',
        'transferFee',
        'addonClause'
      ]))
    } else {
      attributes.startedOn = team.value.currentlyOn
      attributes.endedOn = format(
        subDays(parseISO(endOfCurrentSeason.value), 1),
        'yyyy-MM-dd'
      )
      if (loanOut.value) {
        attributes.origin = team.value.name
      } else {
        attributes.destination = team.value.name
      }
    }
  }

  watchEffect(() => {
    if (!attributes.addonClause) {
      attributes.addonClause = 0
    }
  })

  const { executeMutation: createLoan } = useMutation(gql`
    mutation createLoan($playerId: ID!, $attributes: LoanAttributes!) {
      addLoan(playerId: $playerId, attributes: $attributes) {
        loan { ...LoanData }
        errors { fullMessages }
      }
    }
    ${loanFragment}
  `)

  const { executeMutation: updateLoan } = useMutation(gql`
    mutation ($id: ID!, $attributes: LoanAttributes!) {
      updateLoan(id: $id, attributes: $attributes) {
        loan { ...LoanData }
        errors { fullMessages }
      }
    }
    ${loanFragment}
  `)

  async function onSubmit () {
    if (props.record) {
      const { data: { updateLoan: { errors, loan} } } =
        await updateLoan({ id: props.record.id, attributes })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addLoan: { errors, loan } } } =
        await createLoan({ playerId: props.player.id, attributes })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    }
  }
</script>

<template>
  <dialog-form
    :title="title"
    :submit="onSubmit"
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
          :rules="rulesFor.origin"
          :disabled="loanOut"
        />
      </v-col>
      <v-col cols="12">
        <team-combobox
          v-model="attributes.destination"
          label="Destination"
          prepend-icon="mdi-airplane-landing"
          :rules="rulesFor.destination"
          :disabled="!loanOut"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.wagePercentage"
          label="Wage Percentage (%)"
          :rules="rulesFor.wagePercentage"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="12">
        <money-field
          v-model="attributes.transferFee"
          label="Transfer Fee"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.addonClause"
          label="Add-On Clause (%)"
          :rules="rulesFor.addonClause"
          inputmode="numeric"
        />
      </v-col>
    </template>
  </dialog-form>
</template>

<script setup>
  const { team } = useTeam()

  const props = defineProps({
    playerId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    signedOn: props.record?.signedOn,
    startedOn: props.record?.startedOn,
    endedOn: props.record?.endedOn,
    origin: props.record?.origin,
    destination: props.record?.destination,
    wagePercentage: props.record?.wagePercentage,
    transferFee: props.record?.transferFee,
    addonClause: props.record?.addonClause
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

  const emit = defineEmits(['created', 'click:remove'])
  async function onSubmit () {
    if (props.record) {
      const { data: { updateLoan: { errors, loan} } } =
        await updateLoan({ id: props.record.id, attributes })
      if (loan) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addLoan: { errors, loan } } } =
        await createLoan({ playerId: props.playerId, attributes })
      if (loan) {
        emit('created')
      } else {
        alert(errors.fullMessages[0])
      }
    }
  }
</script>

<template>
  <tr>
    <td>
      <v-text-field
        v-model="attributes.signedOn"
        type="date"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.startedOn"
        type="date"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.endedOn"
        type="date"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.origin"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.destination"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.wagePercentage"
        type="number"
        min="0"
        max="100"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.transferFee"
        type="number"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.addonClause"
        type="number"
        min="0"
        max="25"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn
          icon="mdi-content-save"
          variant="text"
          @click="onSubmit"
        />
        &nbsp;
        <v-btn
          v-if="!!props.record"
          icon="mdi-close"
          variant="text"
          @click="inEditMode = false"
        />
        <v-btn
          v-else
          icon="mdi-delete"
          variant="text"
          @click="emit('click:remove')"
        />
      </template>
      <template v-else>
        <v-btn
          icon="mdi-pencil"
          variant="text"
          @click="inEditMode = true"
        />
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Loan"
          label="Loan"
          icon="mdi-delete"
        />
      </template>
    </td>
  </tr>
</template>

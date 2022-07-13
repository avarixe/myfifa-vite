<script setup>
  import { useTeam } from '~/composables'
  import { loanFragment } from '~/fragments'

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

  const emit = defineEmits()
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
      <input
        v-model="attributes.signedOn"
        type="date"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.startedOn"
        type="date"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.endedOn"
        type="date"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.origin"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.destination"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.wagePercentage"
        type="number"
        min="0"
        max="100"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.transferFee"
        type="number"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.addonClause"
        type="number"
        min="0"
        max="25"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
        <button v-if="!!props.record" href="#" @click="inEditMode = false">Cancel</button>
        <button v-else href="#" @click="$emit('click:remove')">Remove</button>
      </template>
      <template v-else>
        <a href="#" @click="inEditMode = true">Edit</a>
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Loan"
          label="Loan"
        />
      </template>
    </td>
  </tr>
</template>

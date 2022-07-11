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
        v-if="inEditMode"
        v-model="attributes.signedOn"
        type="date"
      />
      <template v-else>{{ record.signedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.startedOn"
        type="date"
      />
      <template v-else>{{ record.startedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.endedOn"
        type="date"
      />
      <template v-else>{{ record.endedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.origin"
      />
      <template v-else>{{ record.origin }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.destination"
      />
      <template v-else>{{ record.destination }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.wagePercentage"
        type="number"
        min="0"
        max="100"
      />
      <template v-else>{{ record.wagePercentage }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.transferFee"
        type="number"
      />
      <template v-else>{{ record.transferFee }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.addonClause"
        type="number"
        min="0"
        max="25"
      />
      <template v-else>{{ record.addonClause }}</template>
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

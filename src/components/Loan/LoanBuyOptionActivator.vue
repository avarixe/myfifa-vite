<script setup lang="ts">
  const props = defineProps({
    player: { type: Object, required: true },
    loan: { type: Object, required: true }
  })

  const { team } = useTeam()

  const { submitForm: onConfirm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: LoanAttributes!) {
        updateLoan(id: $id, attributes: $attributes) {
          loan {
            ...LoanData
          }
        }
      }
      ${loanFragment}
    `,
    variables: () => ({
      id: props.loan.id,
      attributes: {
        ..._pick(props.loan, [
          'signedOn',
          'startedOn',
          'wage',
          'origin',
          'destination'
        ]),
        endedOn: team.value.currentlyOn,
        activatedBuyOption: true
      }
    })
  })
</script>

<template>
  <confirm-dialog
    :confirm-text="`Activate Loan-to-Buy Option for ${player.name}?`"
    @confirm="onConfirm"
  />
</template>

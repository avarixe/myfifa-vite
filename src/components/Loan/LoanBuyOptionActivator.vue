<script setup>
  const props = defineProps({
    player: { type: Object, required: true },
    loan: { type: Object, required: true }
  })

  const { team } = useTeam()

  const { executeMutation: updateLoan } = useMutation(gql`
    mutation ($id: ID!) {
      updateLoan(id: $id) {
        loan {
          ...LoanData
        }
        errors {
          fullMessages
        }
      }
    }
    ${loanFragment}
  `)

  async function onConfirm() {
    const {
      data: {
        updateLoan: { errors }
      }
    } = await updateLoan({
      id: props.loan.id,
      attributes: {
        ...pick(props.loan, [
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
    if (errors) {
      alert(errors.fullMessages[0])
    }
  }
</script>

<template>
  <confirm-dialog
    :confirm-text="`Activate Loan-to-Buy Option for ${player.name}?`"
    @confirm="onConfirm"
  />
</template>

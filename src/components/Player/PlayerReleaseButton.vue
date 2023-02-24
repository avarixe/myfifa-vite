<script setup>
  const props = defineProps({
    player: { type: Object, required: true }
  })

  const { submitForm: onConfirm } = useForm({
    mutation: gql`
      mutation ($id: ID!) {
        releasePlayer(id: $id) {
          player {
            ...PlayerData
          }
        }
      }
      ${playerFragment}
    `,
    variables: { id: props.player.id }
  })
</script>

<template>
  <confirm-dialog
    :confirm-text="`Terminate ${player.name}'s Contract?`"
    @confirm="onConfirm"
  />
</template>

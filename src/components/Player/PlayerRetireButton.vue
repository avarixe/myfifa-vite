<script setup>
  const props = defineProps({
    player: { type: Object, required: true }
  })

  const { executeMutation: retirePlayer } = useMutation(gql`
    mutation ($id: ID!) {
      retirePlayer(id: $id) {
        player {
          ...PlayerData
        }
        errors {
          fullMessages
        }
      }
    }
    ${playerFragment}
  `)

  async function onConfirm() {
    const {
      data: {
        retirePlayer: { errors }
      }
    } = await retirePlayer({ id: props.player.id })
    if (errors) {
      alert(errors.fullMessages[0])
    }
  }
</script>

<template>
  <confirm-dialog
    :confirm-text="`${player.name} is Retiring at the End of Season?`"
    @confirm="onConfirm"
  />
</template>

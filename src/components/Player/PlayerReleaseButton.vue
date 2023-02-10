<script setup>
  const props = defineProps({
    player: { type: Object, required: true }
  })

  const { executeMutation: releasePlayer } = useMutation(gql`
    mutation ($id: ID!) {
      releasePlayer(id: $id) {
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
        releasePlayer: { errors }
      }
    } = await releasePlayer({ id: props.player.id })
    if (errors) {
      alert(errors.fullMessages[0])
    }
  }
</script>

<template>
  <confirm-dialog
    :confirm-text="`Terminate ${player.name}'s Contract?`"
    @confirm="onConfirm"
  />
</template>

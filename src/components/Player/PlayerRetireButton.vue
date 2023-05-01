<script setup lang="ts">
  import { Player } from '~/models'

  const props = defineProps<{ player: Player }>()

  const { submitForm: onConfirm } = useForm({
    mutation: gql`
      mutation ($id: ID!) {
        retirePlayer(id: $id) {
          player {
            ...PlayerData
          }
        }
      }
      ${playerFragment}
    `,
    variables: () => ({ id: props.player.id })
  })
</script>

<template>
  <confirm-dialog
    :confirm-text="`${player.name} is Retiring at the End of Season?`"
    @confirm="onConfirm"
  />
</template>

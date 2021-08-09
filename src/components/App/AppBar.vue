<template>
  <w-toolbar fixed shadow height="3em">
    <div>MyFIFA Manager</div>
    <div class="spacer" />
    <w-button
      lg
      bg-color="transparent"
      @click="logout"
    >
      <w-icon>mdi mdi-exit-to-app</w-icon>
    </w-button>
  </w-toolbar>
  <div
    class="mb4"
    :style="{ height: '3em' }"
  />
</template>

<script setup>
  import { computed } from 'vue'
  import { useMutation } from '@urql/vue'
  import gql from 'graphql-tag'
  import { useAuthStore } from '~/store/auth'

  const authStore = useAuthStore()
  const token = computed(() => authStore.token)

  const { executeMutation: revokeAccessToken } = useMutation(gql`
    mutation revokeAccessToken($token: String!) {
      revokeAccessToken(token: $token) {
        errors { fullMessages }
      }
    }
  `)
  async function logout () {
    const { data: { revokeAccessToken: { errors} } } =
      await revokeAccessToken({ token: token.value })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      authStore.token = null
      localStorage.removeItem('token')
    }
  }
</script>

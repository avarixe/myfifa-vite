<template>
  <h1>MyFIFA Manager</h1>
  <main>
    <router-view />
  </main>
  <button
    v-if="token"
    @click="logout"
  >
    Log Out
  </button>
</template>

<script setup>
  import { computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMutation } from '@urql/vue'
  import gql from 'graphql-tag'
  import { useAuthStore } from '~/store/auth'

  const authStore = useAuthStore()
  const token = computed(() => authStore.token)

  const router = useRouter()
  function redirectIfUnauthenticated () {
    if (token.value) {
      router.push('/')
    } else {
      router.push('/login')
    }
  }
  redirectIfUnauthenticated()
  watch(token, redirectIfUnauthenticated)

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

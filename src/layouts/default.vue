<template>
  <template v-if="token">
    <h1>MyFIFA Manager</h1>
    <main>
      <router-view />
    </main>
    <button @click="logout">Log Out</button>
  </template>
  <template v-else>
    <main>
      <h1>MyFIFA Manager</h1>
      <login-form />
    </main>
  </template>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMutation } from '@urql/vue'
  import gql from 'graphql-tag'
  import { useAuthStore } from '~/store/auth'
  import LoginForm from '~/components/App/LoginForm.vue'

  const authStore = useAuthStore()
  const token = computed(() => authStore.token)

  const router = useRouter()
  token.value && router.push('/teams')

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

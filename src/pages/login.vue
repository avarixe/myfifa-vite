<script setup>
  import { ref } from 'vue'
  import { useMutation } from '@urql/vue'
  import gql from 'graphql-tag'
  import { useAuthStore } from '~/store/auth'
  import { userFragment } from '~/fragments'

  const username = ref('')
  const password = ref('')

  const authStore = useAuthStore()

  const { executeMutation: grantAccessToken } = useMutation(gql`
    mutation grantAccessToken($username: String!, $password: String!) {
      grantAccessToken(username: $username, password: $password) {
        token
        expiresAt
        user { ...UserData }
        errors { fullMessages }
      }
    }
    ${userFragment}
  `)

  async function login () {
    const { data: { grantAccessToken: { token, errors} } } =
      await grantAccessToken({
        username: username.value,
        password: password.value
      })
    if (token) {
      authStore.token = token
      localStorage.setItem('token', token)
    } else {
      alert(errors.fullMessages[0])
    }
  }
</script>

<template>
  <div class="w-flex fill-height align-center justify-center">
    <form @submit.prevent="login">
      <w-card :style="{ width: '400px' }">
        <w-input v-model="username">Username</w-input>
        <w-input
          v-model="password"
          type="password"
          class="mt2"
        >
          Password
        </w-input>
        <template #actions>
          <div class="spacer" />
          <w-button type="submit">Login</w-button>
        </template>
      </w-card>
    </form>
  </div>
</template>

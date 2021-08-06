<template>
  <div>
    <label>Username</label>
    <input v-model="username" />
  </div>
  <div>
    <label>Password</label>
    <input v-model="password" type="password" />
  </div>
  <div>
    <button @click="login">Login</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useMutation } from '@urql/vue'
  import gql from 'graphql-tag'
  import { useAuthStore } from '~/store/auth'
  import { userFragment } from '~/fragments'

  const username = ref('')
  const password = ref('')

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

  const login = async function () {
    console.log('in login')
    const { data: { grantAccessToken: { token, errors} } } =
      await grantAccessToken({
        username: username.value,
        password: password.value
      })
    if (token) {
      useAuthStore().token = token
      localStorage.setItem('token', token)
    } else {
      alert(errors.fullMessages[0])
    }
  }
</script>

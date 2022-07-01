<script setup>
  import { useAuthStore } from '~/store/auth'
  import { userFragment } from '~/fragments'
  import { isRequired } from '~/rules'
  import logo from '~/assets/logo.png'

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

  async function onSubmit () {
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
  <div>
    <div>MyFIFA Manager</div>
    <small>v2.0.0</small>
  </div>
  <hr>
  <div>
    <label for="username">Username</label>
    <input v-model="username" />
  </div>
  <div>
    <label for="password">Password</label>
    <input
      v-model="password"
      type="password"
    />
  </div>
  <button @click="onSubmit">Log In</button>
</template>

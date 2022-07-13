<script setup>
  import { useAuthStore } from '~/store/auth'
  // import logo from '~/assets/logo.png'

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

<template>
  <div>
    <div>MyFIFA Manager</div>
    <small>v3.0.0</small>
  </div>
  <div>
    <router-link to="/">Home</router-link>
    &nbsp;
    <router-link to="/account">Account</router-link>
    &nbsp;
    <button @click="logout">Log Out</button>
  </div>
  <hr>
</template>

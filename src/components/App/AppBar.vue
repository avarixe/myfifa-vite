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
  <v-app-bar app>
    <v-app-bar-nav-icon />
    <v-app-bar-title>
      MyFIFA Manager
      <v-chip color="primary" size="x-small">v3.0.0</v-chip>
    </v-app-bar-title>
    <v-spacer />
    <v-btn icon="mdi-home" to="/" />
    <v-btn icon="mdi-account" to="/account" />
    <v-btn icon="mdi-exit-to-app" @click="logout" />
  </v-app-bar>
</template>

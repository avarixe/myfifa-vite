<script setup>
  import { useAuthStore } from '~/store/auth'
  import logo from '~/assets/logo.png'

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
  <q-toolbar class="glossy">
    <q-avatar>
      <img :src="logo">
    </q-avatar>
    <q-toolbar-title>MyFIFA Manager</q-toolbar-title>
    <q-btn
      to="/account"
      flat
      round
      icon="mdi-account"
    />
    <app-info />
    <q-btn
      flat
      round
      icon="mdi-exit-to-app"
      @click="logout"
    />
  </q-toolbar>
</template>

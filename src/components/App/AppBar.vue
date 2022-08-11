<script setup>
  import { useTeam } from '~/composables'
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

  const { mobile } = useDisplay()
  // const isMobile = computed(() => mobile.value)
  const drawer = ref(!mobile.value)

  const { team } = useTeam()
</script>

<template>
  <v-app-bar app>
    <v-app-bar-nav-icon
      v-if="mobile && !!team"
      @click="drawer = !drawer"
    />
    <v-img
      :src="logo"
      class="ml-2"
      :style="{ maxWidth: '48px' }"
    />
    <v-app-bar-title>MyFIFA Manager</v-app-bar-title>
    <v-spacer />
    <v-btn icon="mdi-account" to="/account" />
    <v-btn icon>
      <v-icon>mdi-information-outline</v-icon>
      <app-info />
    </v-btn>
    <v-btn icon="mdi-exit-to-app" @click="logout" />
  </v-app-bar>

  <team-drawer
    v-if="!!team"
    v-model="drawer"
    app
  />
  <team-mobile-navigator
    v-if="mobile && !!team"
    grow
    hide-on-scroll
  />
</template>

<style scoped>
  .v-app-bar :deep(.v-toolbar-title__placeholder) {
    overflow: inherit;
  }
</style>

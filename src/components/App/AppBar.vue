<script setup>
  import logo from '~/assets/logo.png'

  const { mobile, smAndUp } = useDisplay()
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
    <v-app-bar-title v-if="smAndUp">MyFIFA Manager</v-app-bar-title>
    <v-spacer />
    <v-btn icon="mdi-account" to="/account" />
    <dark-mode-toggle />
    <v-btn icon>
      <v-icon>mdi-information-outline</v-icon>
      <app-info />
    </v-btn>
    <logout-button />
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

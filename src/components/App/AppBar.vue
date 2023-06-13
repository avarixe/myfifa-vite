<script setup lang="ts">
  import logo from '~/assets/logo.png'

  const { mobile, smAndUp } = useDisplay()
  const drawer = ref(!mobile.value)

  const { team } = useTeam()

  const appTitle = __APP_TITLE__
</script>

<template>
  <v-app-bar app image="/app-bar-background.jpg">
    <template #image>
      <v-img
        gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
      />
    </template>
    <v-app-bar-nav-icon v-if="mobile && !!team" @click="drawer = !drawer" />
    <v-img :src="logo" class="ml-2" :style="{ maxWidth: '48px' }" />
    <v-app-bar-title v-if="smAndUp">{{ appTitle }}</v-app-bar-title>
    <v-spacer />
    <v-btn icon="mdi-account" to="/account" />
    <v-btn icon>
      <v-icon>mdi-information-outline</v-icon>
      <app-info />
    </v-btn>
    <logout-button />
  </v-app-bar>

  <team-drawer v-if="!!team" v-model="drawer" app />
  <team-mobile-navigator v-if="mobile && !!team" />
</template>

<style scoped>
  .v-app-bar :deep(.v-toolbar-title__placeholder) {
    overflow: inherit;
  }
</style>

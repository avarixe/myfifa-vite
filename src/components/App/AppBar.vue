<script setup>
  import logo from '~/assets/logo.png'

  const drawer = ref(false)

  const $q = useQuasar()
  watchEffect(() => {
    drawer.value = $q.screen.gt.sm
  })

  const showAppInfo = ref(false)

  const { team } = useTeam()
</script>

<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        v-if="!!team"
        dense
        flat
        round
        icon="mdi-menu"
        class="lt-md"
        @click="drawer = !drawer"
      />

      <q-toolbar-title>
        <q-img :src="logo" class="ml-2" :style="{ maxWidth: '48px' }" />
        <span class="gt-xs">MyFIFA Manager</span>
      </q-toolbar-title>

      <q-space />
      <q-btn icon="mdi-account" dense flat to="/account" />
      <dark-mode-toggle />
      <q-btn icon="mdi-information-outline" dense flat @click="showAppInfo = true" />
      <app-info v-model="showAppInfo" />
      <logout-button />
    </q-toolbar>
  </q-header>

  <team-drawer
    v-if="!!team"
    v-model="drawer"
  />
  <team-mobile-navigator
    v-if="!!team"
    class="lt-md"
  />
</template>

<style scoped>
  .v-app-bar :deep(.v-toolbar-title__placeholder) {
    overflow: inherit;
  }
</style>

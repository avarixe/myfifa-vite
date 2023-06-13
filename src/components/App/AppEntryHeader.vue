<script setup lang="ts">
  import logo from '~/assets/logo.png'

  const appTitle = __APP_TITLE__
  const appVersion = __APP_VERSION__
</script>

<template>
  <v-img :src="logo" height="128px" />
  <div class="text-h3">{{ appTitle }}</div>
  <div class="text-body-2">v{{ appVersion }}</div>
</template>

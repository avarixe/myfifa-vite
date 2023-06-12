<script setup lang="ts">
  import logo from '~/assets/logo.png'

  const version = __APP_VERSION__
</script>

<template>
  <v-img :src="logo" height="128px" />
  <div class="text-h3">MyFIFA Manager</div>
  <div class="text-body-2">v{{ version }}</div>
</template>

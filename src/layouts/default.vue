<template>
  <w-app>
    <app-bar v-if="token" />
    <router-view />
  </w-app>
</template>

<script setup>
  import { computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '~/store/auth'
  import AppBar from '~/components/App/AppBar.vue'

  const authStore = useAuthStore()
  const token = computed(() => authStore.token)

  const router = useRouter()
  const route = useRoute()
  function redirectIfUnauthenticated () {
    if (token.value) {
      if (route.name == 'login') {
        router.push('/')
      }
    } else if (route.name !== 'login') {
      router.push('/login')
    }
  }
  redirectIfUnauthenticated()
  watch(token, redirectIfUnauthenticated)
</script>

<style>
  * {
    font-size: 14px;
    font-family: Helvetica, Arial, sans-serif;

  }
</style>

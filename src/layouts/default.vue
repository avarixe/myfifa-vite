<script setup>
  import { computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '~/store/auth'

  const authStore = useAuthStore()
  const token = computed(() => authStore.token)

  const router = useRouter()
  const route = useRoute()
  watch(token, () => {
    if (token.value) {
      if (route.name === 'login') {
        router.push('/')
      }
    } else if (route.name !== 'login') {
      router.push('/login')
    }
  }, { immediate: true })
</script>

<template>
  <div id="app">
    <app-bar v-if="token" />
    <router-view />
  </div>
</template>

<style>
  * {
    font-size: 14px;
    font-family: Helvetica, Arial, sans-serif;
  }
</style>

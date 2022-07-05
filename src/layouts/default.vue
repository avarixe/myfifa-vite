<script setup>
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
  <app-bar v-if="token" />
  <suspense>
    <router-view />
  </suspense>
</template>

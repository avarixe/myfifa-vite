<script setup>
  import { useTeam } from '~/composables'
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

  const { team } = useTeam()
</script>

<template>
  <app-bar v-if="token" />
  <suspense>
    <router-view />
  </suspense>
  <team-channel
    v-if="team"
    :team="team"
  />
</template>

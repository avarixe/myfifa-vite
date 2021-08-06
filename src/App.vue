<template>
  <router-view />
</template>

<script setup>
  import { computed } from 'vue'
  import { createClient, provideClient } from '@urql/vue'
  import { useAuthStore } from '~/store/auth'

  const authStore = useAuthStore()
  const token = computed(() => authStore.token)

  const client = createClient({
    url: `${import.meta.env.VITE_API_URL}/graphql`,
    fetchOptions: () => ({
      headers: { authorization: token.value ? `Bearer ${token.value}` : '' }
    })
  })

  provideClient(client)
</script>

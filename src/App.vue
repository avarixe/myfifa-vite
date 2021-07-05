<template>
  <router-view />
</template>

<script setup>
  import { createClient, provideClient } from '@urql/vue'
  import { useMainStore } from '~/store/main'

  const { token } = useMainStore()

  const client = createClient({
    url: `${import.meta.env.VITE_API_URL}/graphql`,
    fetchOptions: () => ({
      headers: { authorization: token ? `Bearer ${token}` : '' }
    })
  })

  provideClient(client)
</script>

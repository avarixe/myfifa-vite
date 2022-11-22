<script setup>
  import { createClient, provideClient } from '@urql/vue'

  const { token } = useToken()
  const client = createClient({
    url: `${import.meta.env.VITE_API_URL}/graphql`,
    fetchOptions: () => ({
      headers: { authorization: token.value ? `Bearer ${token.value}` : '' }
    })
  })

  provideClient(client)
</script>

<template>
  <router-view />
</template>

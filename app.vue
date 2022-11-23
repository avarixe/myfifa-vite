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

  const { team } = useTeam()
  const route = useRoute()
  const inPublicPage = computed(() =>
    ['login'].includes(route.name)
  )
</script>

<template>
  <v-app>
    <suspense>
      <app-bar v-if="token" />
    </suspense>
    <v-main>
      <v-container>
        <app-breadcrumbs v-if="token" />
        <suspense v-if="token || inPublicPage">
          <nuxt-page />
        </suspense>
      </v-container>
    </v-main>
  </v-app>
  <team-channel
    v-if="team"
    :team="team"
  />
</template>

<script setup lang="ts">
  import {
    createClient,
    provideClient,
    cacheExchange,
    fetchExchange
  } from '@urql/vue'

  const { token, currentUser } = useSession()
  const client = createClient({
    url: `${import.meta.env.VITE_API_URL}/graphql`,
    exchanges: [cacheExchange, fetchExchange],
    requestPolicy: 'network-only',
    fetchOptions: () => ({
      headers: { authorization: token.value ? `Bearer ${token.value}` : '' }
    })
  })

  provideClient(client)

  const { team } = useTeam()

  const route = useRoute()
  const inPublicPage = computed(() =>
    ['login', 'register'].includes(route.name?.toString())
  )

  const theme = useTheme()
  watchEffect(() => {
    theme.global.name.value = currentUser.value?.darkMode ? 'dark' : 'light'
  })
</script>

<template>
  <v-app>
    <app-bar v-if="token" />
    <v-main>
      <v-container>
        <app-breadcrumbs v-if="token" />
        <app-broadcaster />

        <div
          v-if="
            team &&
            team.startedOn === team.currentlyOn &&
            route.name !== 'teams-teamId-players-import'
          "
          class="mb-2"
        >
          <v-alert type="info" variant="tonal" border="start">
            <v-alert-title>Welcome to {{ team.name }}!</v-alert-title>
            Click
            <v-btn
              :to="`/teams/${team.id}/players/import`"
              text="here"
              variant="plain"
              class="pa-0"
            />
            to begin importing Players
          </v-alert>
        </div>

        <div>
          <suspense v-if="token || inPublicPage">
            <router-view />
          </suspense>
        </div>
      </v-container>
    </v-main>
  </v-app>
  <team-channel v-if="team" :team="team" />
</template>

<style>
  html {
    overflow-y: auto;
  }

  .sticky {
    position: sticky;
    left: 0;
    z-index: 1;
  }
</style>

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
    if (currentUser.value) {
      theme.global.name.value = currentUser.value.darkMode ? 'dark' : 'light'
    } else {
      theme.global.name.value = 'dark'
    }
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

<style lang="scss">
  html {
    overflow-y: auto;
  }

  .v-application {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;

    &.v-theme--light {
      background-image: linear-gradient(
          to right top,
          rgba(207, 216, 220, 0.5),
          rgba(176, 190, 197, 0.95)
        ),
        url('/background.jpg');
    }
    &.v-theme--dark {
      background-image: linear-gradient(
          to right top,
          rgba(55, 71, 79, 0.7),
          rgba(38, 50, 56, 0.95)
        ),
        url('/background.jpg');
    }
  }

  .sticky {
    position: sticky;
    left: 0;
    z-index: 1;
  }
</style>

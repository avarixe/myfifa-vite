<script setup lang="ts">
  import {
    createClient,
    provideClient,
    cacheExchange,
    fetchExchange
  } from '@urql/vue'

  const { token } = useSession()
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
    ['/login', '/register'].includes(String(route.name))
  )
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
            route.name !== '/teams/[teamId]/players/import'
          "
          class="mb-2"
        >
          <v-alert type="info" variant="tonal" border="start">
            <v-alert-title>
              Welcome to {{ team.name }}, {{ team.managerName }}!
            </v-alert-title>
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

        <router-view v-slot="{ Component }">
          <template v-if="(token || inPublicPage) && Component">
            <v-fade-transition mode="out-in">
              <keep-alive>
                <div :key="route.path">
                  <suspense :timeout="0">
                    <component :is="Component" />

                    <template #fallback>
                      <v-fade-transition mode="out-in">
                        <div>Loading...</div>
                      </v-fade-transition>
                    </template>
                  </suspense>
                </div>
              </keep-alive>
            </v-fade-transition>
          </template>
        </router-view>
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
    background-repeat: no-repeat !important;
    background-position: center !important;
    background-size: cover !important;
    background-attachment: fixed !important;

    &.v-theme--dark {
      background-image: linear-gradient(
          to right top,
          rgba(55, 71, 79, 0.7),
          rgba(38, 50, 56, 0.95)
        ),
        url('/background.jpg');
    }
  }

  .v-table.v-table--hover > .v-table__wrapper > table > tbody > tr:hover {
    td.v-data-table-column--fixed {
      background: rgb(var(--v-theme-surface));
    }
  }
</style>

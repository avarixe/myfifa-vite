<script setup>
  const { token } = useToken()
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
          <router-view />
        </suspense>
      </v-container>
    </v-main>
  </v-app>
  <team-channel
    v-if="team"
    :team="team"
  />
</template>

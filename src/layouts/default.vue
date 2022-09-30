<script setup>
  const router = useRouter()
  const route = useRoute()
  const token = useToken()
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
  <v-app>
    <suspense>
      <app-bar v-if="token" />
    </suspense>
    <v-main>
      <v-container>
        <app-breadcrumbs v-if="token" />
        <suspense>
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

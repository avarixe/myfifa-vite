<script setup>
  import { useAuthStore } from '~/store/auth'
  import { useNavigationStore } from '~/store/navigation'

  const authStore = useAuthStore()
  const token = computed(() => authStore.token)

  const { executeMutation: revokeAccessToken } = useMutation(gql`
    mutation revokeAccessToken($token: String!) {
      revokeAccessToken(token: $token) {
        errors { fullMessages }
      }
    }
  `)
  async function logout () {
    const { data: { revokeAccessToken: { errors} } } =
      await revokeAccessToken({ token: token.value })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      authStore.token = null
      localStorage.removeItem('token')
    }
  }

  const navigationStore = useNavigationStore()
  const breadcrumbs = computed(() => navigationStore.breadcrumbs)
</script>

<template>
  <q-toolbar class="glossy">
    <q-toolbar-title>MyFIFA Manager</q-toolbar-title>
    <q-btn flat @click="logout">Log Out</q-btn>
  </q-toolbar>
  <q-toolbar
    v-if="breadcrumbs.length > 0"
    inset
  >
    <q-breadcrumbs>
      <q-breadcrumbs-el
        v-for="(breadcrumb, i) in breadcrumbs"
        :key="i"
        v-bind="breadcrumb"
      />
    </q-breadcrumbs>
  </q-toolbar>
</template>

<script setup>
  import { useTeam } from '~/composables'
  import { useAuthStore } from '~/store/auth'

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

  const { team } = useTeam()
</script>

<template>
  <div>
    <div>MyFIFA Manager</div>
    <div v-if="team">{{ team.name }}</div>
    <button @click="logout">Log Out</button>
  </div>
</template>

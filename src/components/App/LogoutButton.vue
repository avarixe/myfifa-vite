<script setup>
  const { executeMutation: revokeAccessToken } = useMutation(gql`
    mutation revokeAccessToken($token: String!) {
      revokeAccessToken(token: $token) {
        errors {
          fullMessages
        }
      }
    }
  `)

  const { token, clearSession } = useSession()
  const router = useRouter()
  async function logout() {
    const {
      data: {
        revokeAccessToken: { errors }
      }
    } = await revokeAccessToken({ token: token.value })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      clearSession()
      router.push('/login')
    }
  }
</script>

<template>
  <v-btn icon="mdi-exit-to-app" @click="logout" />
</template>

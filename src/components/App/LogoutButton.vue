<script setup>
  const { executeMutation: revokeAccessToken } = useMutation(gql`
    mutation revokeAccessToken($token: String!) {
      revokeAccessToken(token: $token) {
        errors { fullMessages }
      }
    }
  `)

  const { token, clearToken } = useToken()
  const router = useRouter()
  async function logout () {
    const { data: { revokeAccessToken: { errors} } } =
      await revokeAccessToken({ token: token.value })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      clearToken()
      router.push('/login')
    }
  }
</script>

<template>
  <q-btn dense flat icon="mdi-exit-to-app" @click="logout" />
</template>

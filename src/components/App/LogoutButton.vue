<script setup lang="ts">
  const { token, clearSession } = useSession()
  const router = useRouter()
  const { submitForm: logout, formIsLoading } = useForm({
    mutation: gql`
      mutation revokeAccessToken($token: String!) {
        revokeAccessToken(token: $token) {
          confirmation
        }
      }
    `,
    variables: () => ({ token: token.value }),
    onSuccess() {
      clearSession()
      router.push('/login')
    }
  })
</script>

<template>
  <v-btn icon="mdi-exit-to-app" :loading="formIsLoading" @click="logout" />
</template>

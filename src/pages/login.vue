<script setup lang="ts">
  import { User } from '~/models'

  const username = ref('')
  const password = ref('')

  const { sessionStore } = useSession()
  const router = useRouter()
  const { form, formIsLoading, submitForm } = useForm({
    mutation: gql`
      mutation grantAccessToken($username: String!, $password: String!) {
        grantAccessToken(username: $username, password: $password) {
          token
          expiresAt
          user {
            ...UserData
          }
        }
      }
      ${userFragment}
    `,
    variables: () => ({
      username: username.value,
      password: password.value
    }),
    onSuccess(data) {
      const {
        grantAccessToken: { token, user }
      } = data
      useRepo(User).save(user)
      sessionStore.token = token
      sessionStore.userId = parseInt(user.id)
      router.push(sessionStore.redirectUrl || '/')
    }
  })

  const showPassword = ref(false)
</script>

<template>
  <div
    class="d-flex align-center justify-center"
    :style="{ minHeight: '90vh' }"
  >
    <v-form ref="form" @submit.prevent="submitForm">
      <v-card>
        <v-card-title class="text-center">
          <app-entry-header />
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="username"
            label="Username"
            autofocus
            autocapitalize="off"
          />
          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="`mdi-eye${showPassword ? '' : '-off'}`"
            @click:append-inner="showPassword = !showPassword"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" color="primary" :loading="formIsLoading">
            Log In
          </v-btn>
          <v-btn to="/register">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

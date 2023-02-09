<script setup>
  import { User } from '~/models'

  const username = ref('')
  const password = ref('')

  const { executeMutation: grantAccessToken } = useMutation(gql`
    mutation grantAccessToken($username: String!, $password: String!) {
      grantAccessToken(username: $username, password: $password) {
        token
        expiresAt
        user {
          ...UserData
        }
        errors {
          fullMessages
        }
      }
    }
    ${userFragment}
  `)

  const loading = ref(false)
  const { sessionStore } = useSession()
  const router = useRouter()
  async function onSubmit() {
    loading.value = true
    const {
      data: {
        grantAccessToken: { token, user, errors }
      }
    } = await grantAccessToken({
      username: username.value,
      password: password.value
    })
    if (token) {
      useRepo(User).save(user)
      sessionStore.token = token
      sessionStore.userId = parseInt(user.id)
      router.push(sessionStore.redirectUrl || '/')
    } else {
      alert(errors.fullMessages[0])
    }
    loading.value = false
  }

  const showPassword = ref(false)
</script>

<template>
  <div
    class="d-flex align-center justify-center"
    :style="{ minHeight: '90vh' }"
  >
    <v-form @submit.prevent="onSubmit">
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
          <v-btn type="submit" color="primary" :loading="loading">Log In</v-btn>
          <v-btn to="/register">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script setup>
  import { useAuthStore } from '~/store/auth'
  import logo from '~/assets/logo.png'

  const username = ref('')
  const password = ref('')

  const authStore = useAuthStore()

  const { executeMutation: grantAccessToken } = useMutation(gql`
    mutation grantAccessToken($username: String!, $password: String!) {
      grantAccessToken(username: $username, password: $password) {
        token
        expiresAt
        user { ...UserData }
        errors { fullMessages }
      }
    }
    ${userFragment}
  `)

  const loading = ref(false)
  async function onSubmit () {
    loading.value = true
    const { data: { grantAccessToken: { token, errors} } } =
      await grantAccessToken({
        username: username.value,
        password: password.value
      })
    if (token) {
      authStore.token = token
      localStorage.setItem('token', token)
    } else {
      alert(errors.fullMessages[0])
    }
    loading.value = false
  }

  const showPassword = ref(false)
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-card>
      <v-card-title>
        <v-img
          :src="logo"
          height="128px"
        />
        <div>MyFIFA Manager</div>
        <small>v3.0.0</small>
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
        <v-btn
          type="submit"
          color="primary"
          text
          :loading="loading"
        >
          Log In
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

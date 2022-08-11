<script setup>
  import { useAuthStore } from '~/store/auth'
  import { userFragment } from '~/fragments'
  import { isRequired } from '~/rules'
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

  async function onSubmit () {
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
  }
</script>

<template>
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
      />
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        text
        @click="onSubmit"
      >
        Log In
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

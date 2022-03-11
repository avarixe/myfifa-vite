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
  <div class="column absolute-center q-col-gutter-md">
    <div class="col">
      <q-img
        :src="logo"
        fit="contain"
        height="128px"
      />
    </div>
    <div class="col text-center">
      <div class="text-h4">MyFIFA Manager</div>
      <div class="text-caption">v2.0.0</div>
    </div>
    <div class="col">
      <q-form @submit="onSubmit">
        <q-card>
          <q-card-section>
            <q-input
              v-model="username"
              label="Username"
              :rules="[isRequired('Username')]"
            />
            <q-input
              v-model="password"
              label="Password"
              :rules="[isRequired('Password')]"
              type="password"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn
              type="submit"
              label="Log In"
              color="primary"
              flat
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </div>
</template>

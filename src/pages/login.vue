<script setup>
  import { User } from '~/models'
  import logo from '~/assets/logo.png'

  const username = ref('')
  const password = ref('')

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
  const { setToken, authStore } = useToken()
  const router = useRouter()
  async function onSubmit () {
    loading.value = true
    const { data: { grantAccessToken: { token, user, errors } } } =
      await grantAccessToken({
        username: username.value,
        password: password.value
      })
    if (token) {
      setToken(token)
      useRepo(User).save(user)
      authStore.userId = parseInt(user.id)
      router.push(authStore.redirectUrl || '/')
    } else {
      alert(errors.fullMessages[0])
    }
    loading.value = false
  }

  const showPassword = ref(false)
</script>

<template>
  <div class="w-full h-screen flex flex-center">
    <q-form @submit="onSubmit">
      <q-card class="w-100">
        <q-card-section>
          <div class="text-center">
            <q-img :src="logo" width="128px" />
            <div class="text-h4">MyFIFA Manager</div>
            <div class="text-caption">v3.0.0</div>
          </div>
          <q-input
            v-model="username"
            label="Username"
            autofocus
            autocapitalize="off"
          />
          <q-input
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="`mdi-eye${showPassword ? '' : '-off'}`"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions>
          <q-btn
            type="submit"
            color="primary"
            flat
            :loading="loading"
          >
            Log In
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</template>

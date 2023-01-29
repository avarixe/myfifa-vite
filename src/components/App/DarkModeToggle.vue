<script setup>
  import { User } from '~/models'

  const authStore = useAuthStore()
  const userRepo = useRepo(User)
  const user = computed(() => userRepo.find(authStore.userId))

  const { executeMutation: updateUser } = useMutation(gql`
    mutation updateUser($id: ID!, $attributes: UserAttributes!) {
      updateUser(id: $id, attributes: $attributes) {
        user { id darkMode }
        errors { fullMessages }
      }
    }
  `)

  const loading = ref(false)
  async function toggleMode () {
    loading.value = true
    const { data: { updateUser: { errors } } } = await updateUser({
      id: user.value.id,
      attributes: { darkMode: !user.value.darkMode }
    })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      useRepo(User).save({
        id: user.value.id,
        darkMode: !user.value.darkMode
      })
    }
    loading.value = false
  }

  const theme = useTheme()
  watchEffect(() => {
    if (user.value) {
      theme.global.name.value = user.value.darkMode ? 'dark' : 'light'
    }
  })
</script>

<template>
  <v-btn
    v-if="user"
    :icon="`mdi-weather-${user.darkMode ? 'night' : 'sunny'}`"
    :loading="loading"
    @click="toggleMode"
  />
</template>

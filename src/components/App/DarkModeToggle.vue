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
      userRepo.save({
        id: user.value.id,
        darkMode: !user.value.darkMode
      })
    }
    loading.value = false
  }

  const $q = useQuasar()
  watchEffect(() => {
    if (user.value) {
      $q.dark.set(user.value.darkMode)
    }
  })
</script>

<template>
  <q-btn
    v-if="user"
    :icon="`mdi-weather-${user.darkMode ? 'night' : 'sunny'}`"
    flat
    dense
    :loading="loading"
    @click="toggleMode"
  />
</template>

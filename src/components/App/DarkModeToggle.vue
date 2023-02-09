<script setup>
  import { User } from '~/models'

  const { currentUser } = useSession()

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
      id: currentUser.value.id,
      attributes: { darkMode: !currentUser.value.darkMode }
    })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      useRepo(User).save({
        id: currentUser.value.id,
        darkMode: !currentUser.value.darkMode
      })
    }
    loading.value = false
  }
</script>

<template>
  <v-btn
    v-if="currentUser"
    :icon="`mdi-weather-${currentUser.darkMode ? 'night' : 'sunny'}`"
    :loading="loading"
    @click="toggleMode"
  />
</template>

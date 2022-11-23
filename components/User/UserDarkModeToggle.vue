<script setup>
  import { User } from '~/models'

  const props = defineProps({
    user: { type: Object, required: true }
  })

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
      id: props.user.id,
      attributes: { darkMode: !props.user.darkMode }
    })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      useRepo(User).save({
        id: props.user.id,
        darkMode: !props.user.darkMode
      })
    }
    loading.value = false
  }

  const theme = useTheme()
  watchEffect(() => {
    theme.global.name.value = props.user.darkMode ? 'dark' : 'light'
  })
</script>

<template>
  <v-btn
    :icon="`mdi-weather-${user.darkMode ? 'night' : 'sunny'}`"
    :loading="loading"
    @click="toggleMode"
  />
</template>

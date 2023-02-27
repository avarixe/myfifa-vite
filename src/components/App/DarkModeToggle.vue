<script setup>
  const { currentUser } = useSession()

  const { submitForm: toggleMode, formIsLoading } = useForm({
    mutation: gql`
      mutation updateUser($id: ID!, $attributes: UserAttributes!) {
        updateUser(id: $id, attributes: $attributes) {
          user {
            id
            darkMode
          }
        }
      }
    `,
    variables: () => ({
      id: currentUser.value.id,
      attributes: { darkMode: !currentUser.value.darkMode }
    }),
    onSuccess() {
      useRepo(User).save({
        id: currentUser.value.id,
        darkMode: !currentUser.value.darkMode
      })
    }
  })
</script>

<template>
  <v-btn
    v-if="currentUser"
    :icon="`mdi-weather-${currentUser.darkMode ? 'night' : 'sunny'}`"
    :loading="formIsLoading"
    @click="toggleMode"
  />
</template>

<script setup>
  const props = defineProps({
    user: { type: Object, required: true }
  })

  const attributes = reactive(
    pick(props.user, ['fullName', 'username', 'email'])
  )

  const { executeMutation: updateUser } = useMutation(gql`
    mutation updateUser($id: ID!, $attributes: UserAttributes!) {
      updateUser(id: $id, attributes: $attributes) {
        user { ...UserData }
        errors { fullMessages }
      }
    }
    ${userFragment}
  `)

  const loading = ref(false)
  async function onSubmit () {
    loading.value = true
    const { data: { updateUser: { errors } } } =
      await updateUser({ id: props.user.id, attributes })
    errors && alert(errors.fullMessages[0])
    loading.value = false
  }
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-card>
      <v-card-title>Profile</v-card-title>
      <v-card-text>
        <v-text-field v-model="attributes.fullName" label="Name" />
        <v-text-field v-model="attributes.username" label="Username" />
        <v-text-field v-model="attributes.email" label="Email Address" type="email" />
      </v-card-text>
      <v-card-actions>
        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

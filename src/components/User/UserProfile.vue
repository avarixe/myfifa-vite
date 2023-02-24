<script setup>
  const props = defineProps({
    user: { type: Object, required: true }
  })

  const attributes = reactive(
    pick(props.user, ['fullName', 'username', 'email'])
  )

  const { form, formIsLoading, submitForm } = useForm({
    mutation: gql`
      mutation updateUser($id: ID!, $attributes: UserAttributes!) {
        updateUser(id: $id, attributes: $attributes) {
          user {
            ...UserData
          }
        }
      }
      ${userFragment}
    `,
    variables: () => ({ id: props.user.id, attributes })
  })
</script>

<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <v-card>
      <v-card-title>Profile</v-card-title>
      <v-card-text>
        <v-text-field v-model="attributes.fullName" label="Name" />
        <v-text-field v-model="attributes.username" label="Username" />
        <v-text-field
          v-model="attributes.email"
          label="Email Address"
          type="email"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" color="primary" :loading="formIsLoading">
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

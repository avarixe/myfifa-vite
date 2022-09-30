<script setup>
  const attributes = reactive({
    currentPassword: '',
    password: '',
    passwordConfirmation: ''
  })

  const { executeMutation: changePassword } = useMutation(gql`
    mutation changePassword($attributes: UserPasswordChangeAttributes!) {
      changePassword(attributes: $attributes) {
        errors { fullMessages }
      }
    }
  `)

  const loading = ref(false)
  async function onSubmit () {
    loading.value = true
    const { data: { updateUser: { errors } } } =
      await changePassword({ attributes })
    errors && alert(errors.fullMessages[0])
    loading.value = false
  }
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-card>
      <v-card-title>Change Password</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="attributes.currentPassword"
          label="Current Password"
          type="password"
        />
        <v-text-field
          v-model="attributes.password"
          label="New Password"
          type="password"
          autocomplete="new-password"
        />
        <v-text-field
          v-model="attributes.passwordConfirmation"
          label="Confirm New Password"
          type="password"
          autocomplete="new-password"
        />
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

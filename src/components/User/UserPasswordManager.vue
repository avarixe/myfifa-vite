<script setup>
  import { isRequired } from '~/rules'

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

  async function onSubmit () {
    const { data: { updateUser: { errors } } } =
      await changePassword({ attributes })
    errors && alert(errors.fullMessages[0])
  }
</script>

<template>
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
        color="primary"
        @click="onSubmit"
      >
        Update
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

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
  <h4>Change Password</h4>

  <div>
    <label for="currentPassword">Current Password</label>
    <input
      v-model="attributes.currentPassword"
      type="password"
    />
  </div>
  <div>
    <label for="newPassword">New Password</label>
    <input
      v-model="attributes.password"
      type="password"
      autocomplete="new-password"
    />
  </div>
  <div>
    <label for="confirmPassword">Confirm New Password</label>
    <input
      v-model="attributes.passwordConfirmation"
      type="password"
      autocomplete="new-password"
    />
  </div>
  <button @click="onSubmit">Update</button>
</template>

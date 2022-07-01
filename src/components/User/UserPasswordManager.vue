<script setup>
  import { isRequired } from '~/rules'

  const props = defineProps({
    user: { type: Object, required: true }
  })

  const currentPassword = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')

  const { executeMutation: changePassword } = useMutation(gql`
    mutation changePassword($attributes: UserPasswordChangeAttributes!) {
      changePassword(attributes: $attributes) {
        errors { fullMessages }
      }
    }
  `)

  async function onSubmit () {
    const { data: { updateUser: { errors } } } = await changePassword({
      attributes: {
        currentPassword: currentPassword.value,
        password: password.value,
        passwordConfirmation: passwordConfirmation.value
      }
    })
    errors && alert(errors.fullMessages[0])
  }
</script>

<template>
  <h4>Change Password</h4>

  <div>
    <label for="currentPassword">Current Password</label>
    <input
      v-model="currentPassword"
      type="password"
    />
  </div>
  <div>
    <label for="newPassword">New Password</label>
    <input
      v-model="password"
      type="password"
      autocomplete="new-password"
    />
  </div>
  <div>
    <label for="confirmPassword">Confirm New Password</label>
    <input
      v-model="passwordConfirmation"
      type="password"
      autocomplete="new-password"
    />
  </div>
  <button @click="onSubmit">Update</button>
</template>

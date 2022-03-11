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
  <q-form @submit="onSubmit">
    <q-card>
      <q-card-section class="bg-warning text-white glossy">
        <div class="text-h6">Change Password</div>
      </q-card-section>
      <q-card-section>
          <q-input
            v-model="currentPassword"
            label="Current Password"
            type="password"
            :rules="[isRequired('Current Password')]"
          />
          <q-input
            v-model="password"
            label="New Password"
            type="password"
            :rules="[isRequired('New Password')]"
            autocomplete="new-password"
          />
          <q-input
            v-model="passwordConfirmation"
            label="Confirm New Password"
            type="password"
            :rules="[isRequired('Password Confirmation')]"
            autocomplete="new-password"
          />
      </q-card-section>
      <q-card-actions>
        <q-btn
          type="submit"
          label="Update"
          color="warning"
          flat
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

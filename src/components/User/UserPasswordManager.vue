<script setup>
  const props = defineProps({
    user: { type: Object, required: true }
  })

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
  <q-form @submit="onSubmit">
    <q-card>
      <q-card-section>
        <div class="text-h4">Change Password</div>
        <input
          name="username"
          :value="user.username"
          class="hidden"
          autocomplete="username"
        />
        <q-input
          v-model="attributes.currentPassword"
          label="Current Password"
          type="password"
          autocomplete="current-password"
        />
        <q-input
          v-model="attributes.password"
          label="New Password"
          type="password"
          autocomplete="new-password"
        />
        <q-input
          v-model="attributes.passwordConfirmation"
          label="Confirm New Password"
          type="password"
          autocomplete="new-password"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          type="submit"
          color="primary"
          flat
          :loading="loading"
        >
          Update
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

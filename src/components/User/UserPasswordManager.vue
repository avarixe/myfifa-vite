<script setup lang="ts">
  import { User } from '~/models'

  defineProps<{ user: User }>()

  const attributes = reactive({
    currentPassword: '',
    password: '',
    passwordConfirmation: ''
  })

  const { form, formIsLoading, submitForm } = useForm({
    mutation: gql`
      mutation changePassword($attributes: UserPasswordChangeAttributes!) {
        changePassword(attributes: $attributes) {
          confirmation
        }
      }
    `,
    variables: () => ({ attributes })
  })
</script>

<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <v-card>
      <v-card-title>Change Password</v-card-title>
      <v-card-text>
        <input
          name="username"
          :value="user.username"
          class="d-none"
          autocomplete="username"
        />
        <v-text-field
          v-model="attributes.currentPassword"
          label="Current Password"
          type="password"
          autocomplete="current-password"
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
        <v-btn type="submit" color="primary" :loading="formIsLoading">
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
  const attributes = reactive({
    fullName: '',
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const router = useRouter()
  const broadcastStore = useBroadcastStore()
  const { form, formIsLoading, submitForm } = useForm({
    mutation: gql`
      mutation createUser($attributes: UserRegistrationAttributes!) {
        registerUser(attributes: $attributes) {
          user {
            ...UserData
          }
        }
      }
      ${userFragment}
    `,
    variables: () => ({ attributes }),
    onSuccess() {
      broadcastStore.info('Account has been created!')
      router.push('/')
    }
  })

  const showPassword = ref(false)
</script>

<template>
  <div
    class="d-flex align-center justify-center"
    :style="{ minHeight: '90vh' }"
  >
    <v-form ref="form" @submit.prevent="submitForm">
      <v-card>
        <v-card-title class="text-center">
          <app-entry-header />
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="attributes.fullName" label="Name" />
          <v-text-field v-model="attributes.username" label="Username" />
          <v-text-field
            v-model="attributes.email"
            label="Email Address"
            type="email"
          />
          <v-text-field
            v-model="attributes.password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :append-inner-icon="`mdi-eye${showPassword ? '' : '-off'}`"
            @click:append-inner="showPassword = !showPassword"
          />
          <v-text-field
            v-model="attributes.passwordConfirmation"
            label="Confirm Password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :append-inner-icon="`mdi-eye${showPassword ? '' : '-off'}`"
            @click:append-inner="showPassword = !showPassword"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" color="primary" :loading="formIsLoading">
            Create Account
          </v-btn>
          <v-spacer />
          <v-btn to="/login" size="small"> Back to Login </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

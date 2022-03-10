<script setup>
  import { isRequired } from '~/functions'
  import { userFragment } from '~/fragments'

  const props = defineProps({
    user: { type: Object, required: true }
  })

  const fullName = ref(props.user.fullName)
  const username = ref(props.user.username)
  const email = ref(props.user.email)

  const { executeMutation: updateUser } = useMutation(gql`
    mutation updateUser($attributes: UserAttributes!) {
      updateUser(attributes: $attributes) {
        user { ...UserData }
        errors { fullMessages }
      }
    }
    ${userFragment}
  `)

  async function onSubmit () {
    const { data: { updateUser: { errors } } } = await updateUser({
      attributes: {
        fullName: fullName.value,
        username: username.value,
        email: email.value
      }
    })
    errors && alert(errors.fullMessages[0])
  }
</script>

<template>
  <q-form @submit="onSubmit">
    <q-card>
      <q-card-section class="bg-info text-white glossy">
        <div class="text-h6">Profile</div>
      </q-card-section>
      <q-card-section>
          <q-input
            v-model="fullName"
            label="Name"
            :rules="[isRequired('Name')]"
          />
          <q-input
            v-model="username"
            label="Username"
            :rules="[isRequired('Username')]"
          />
          <q-input
            v-model="email"
            label="Email Address"
            type="email"
            :rules="[isRequired('Email Address')]"
          />
      </q-card-section>
      <q-card-actions>
        <q-btn
          type="submit"
          label="Update"
          color="primary"
          flat
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

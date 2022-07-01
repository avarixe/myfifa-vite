<script setup>
  import { isRequired } from '~/rules'
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
  <h4>Profile</h4>

  <div>
    <label>Name</label>
    <input v-model="fullName" />
  </div>
  <div>
    <label>Username</label>
    <input v-model="username" />
  </div>
  <div>
    <label>Email Address</label>
    <input
      v-model="email"
      type="email"
    />
  </div>
  <button @click="onSubmit">Update</button>
</template>

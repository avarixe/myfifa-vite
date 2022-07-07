<script setup>
  import { userFragment } from '~/fragments'

  const props = defineProps({
    record: { type: Object, required: true }
  })

  const attributes = reactive({
    fullName: props.record.fullName,
    username: props.record.username,
    email: props.record.email
  })

  const { executeMutation: updateUser } = useMutation(gql`
    mutation updateUser($id: ID!, $attributes: UserAttributes!) {
      updateUser(id: $id, attributes: $attributes) {
        user { ...UserData }
        errors { fullMessages }
      }
    }
    ${userFragment}
  `)

  async function onSubmit () {
    const { data: { updateUser: { errors } } } =
      await updateUser({ id: props.record.id, attributes })
    errors && alert(errors.fullMessages[0])
  }
</script>

<template>
  <h4>Profile</h4>

  <div>
    <label>Name</label>
    <input v-model="attributes.fullName" />
  </div>
  <div>
    <label>Username</label>
    <input v-model="attributes.username" />
  </div>
  <div>
    <label>Email Address</label>
    <input
      v-model="attributes.email"
      type="email"
    />
  </div>
  <button @click="onSubmit">Update</button>
</template>

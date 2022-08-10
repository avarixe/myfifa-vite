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
  <v-card>
    <v-card-title>Profile</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="attributes.fullName"
        label="Name"
      />
      <v-text-field
        v-model="attributes.username"
        label="Username"
      />
      <v-text-field
        v-model="attributes.email"
        label="Email Address"
        type="email"
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

<script setup>
  const props = defineProps({
    user: { type: Object, required: true }
  })

  const attributes = reactive(
    pick(props.user, ['fullName', 'username', 'email'])
  )

  const { executeMutation: updateUser } = useMutation(gql`
    mutation updateUser($id: ID!, $attributes: UserAttributes!) {
      updateUser(id: $id, attributes: $attributes) {
        user { ...UserData }
        errors { fullMessages }
      }
    }
    ${userFragment}
  `)

  const loading = ref(false)
  async function onSubmit () {
    loading.value = true
    const { data: { updateUser: { errors } } } =
      await updateUser({ id: props.user.id, attributes })
    errors && alert(errors.fullMessages[0])
    loading.value = false
  }
</script>

<template>
  <q-form @submit="onSubmit">
    <q-card>
      <q-card-section>
        <div class="text-h4">Profile</div>
        <q-input
          v-model="attributes.fullName"
          label="Name"
        />
        <q-input
          v-model="attributes.username"
          label="Username"
        />
        <q-input
          v-model="attributes.email"
          label="Email Address"
          type="email"
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

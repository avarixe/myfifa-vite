<script setup>
  const props = defineProps({
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    name: props.record?.name || '',
    startedOn: props.record?.startedOn || format(new Date(), 'yyyy-MM-dd'),
    currentlyOn: props.record?.currentlyOn || format(new Date(), 'yyyy-MM-dd'),
    currency: props.record?.currency || '$'
  })

  const { executeMutation: createTeam } = useMutation(gql`
    mutation createTeam($attributes: TeamAttributes!) {
      addTeam(attributes: $attributes) {
        team { ...TeamData }
        errors { fullMessages }
      }
    }
    ${teamFragment}
  `)

  const { executeMutation: updateTeam } = useMutation(gql`
    mutation ($id: ID!, $attributes: TeamAttributes!) {
      updateTeam(id: $id, attributes: $attributes) {
        team { ...TeamData }
        errors { fullMessages }
      }
    }
    ${teamFragment}
  `)

  const loading = ref(false)
  const router = useRouter()
  async function onSubmit () {
    loading.value = true
    if (props.record) {
      const { data: { updateTeam: { errors, team} } } =
        await updateTeam({ id: props.record.id, attributes })
      if (team) {
        router.push(`/teams/${team.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addTeam: { errors, team } } } =
        await createTeam({ attributes })
      if (team) {
        router.push(`/teams/${team.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    }
    loading.value = false
  }
</script>

<template>
  <q-form @submit="onSubmit">
    <team-combobox
      v-model="attributes.name"
      label="Name"
      class="mt-4"
    />
    <date-field
      v-model="attributes.startedOn"
      label="Start Date"
      class="mt-4"
    />
    <date-field
      v-model="attributes.currentlyOn"
      label="Current Date"
      class="mt-4"
    />
    <q-input
      v-model="attributes.currency"
      label="Currency"
      class="mt-4"
    />
    <q-btn
      type="submit"
      :loading="loading"
      :label="props.record ? 'Update' : 'Create'"
      class="mt-4"
    />
  </q-form>
</template>

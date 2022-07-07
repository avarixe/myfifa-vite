<script setup>
  import { teamFragment } from '~/fragments'

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

  const router = useRouter()
  async function onSubmit () {
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
  }
</script>

<template>
  <div>
    <label>Name:</label>
    <input v-model="attributes.name" />
  </div>
  <div>
    <label>Start Date:</label>
    <input
      v-model="attributes.startedOn"
      type="date"
    />
  </div>
  <div>
    <label>Current Date:</label>
    <input
      v-model="attributes.currentlyOn"
      type="date"
    />
  </div>
  <div>
    <label>Currency:</label>
    <input v-model="attributes.currency" />
  </div>
  <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
</template>

<script setup lang="ts">
  const props = defineProps({
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    name: props.record?.name || '',
    startedOn: props.record?.startedOn || format(new Date(), 'yyyy-MM-dd'),
    currentlyOn: props.record?.currentlyOn || format(new Date(), 'yyyy-MM-dd'),
    currency: props.record?.currency || '$'
  })

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: TeamAttributes!) {
          updateTeam(id: $id, attributes: $attributes) {
            team {
              ...TeamData
            }
          }
        }
        ${teamFragment}
      `
    : gql`
        mutation createTeam($attributes: TeamAttributes!) {
          addTeam(attributes: $attributes) {
            team {
              ...TeamData
            }
          }
        }
        ${teamFragment}
      `
  function variables() {
    return props.record ? { attributes } : { id: props.record.id, attributes }
  }

  const router = useRouter()
  const { form, formIsLoading, submitForm } = useForm({
    mutation,
    variables,
    onSuccess(data) {
      const team = Object.values(data)[0].team
      router.push(`/teams/${team.id}`)
    }
  })
</script>

<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <team-combobox v-model="attributes.name" label="Name" />
    <date-field v-model="attributes.startedOn" label="Start Date" />
    <date-field v-model="attributes.currentlyOn" label="Current Date" />
    <v-text-field v-model="attributes.currency" label="Currency" />
    <v-btn type="submit" :loading="formIsLoading">
      {{ props.record ? 'Update' : 'Create' }}
    </v-btn>
  </v-form>
</template>

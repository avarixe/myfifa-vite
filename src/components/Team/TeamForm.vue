<script setup lang="ts">
  import { Team } from '~/models'

  const props = defineProps<{
    record?: Team
  }>()

  const { currentUser } = useSession()
  const attributes = reactive({
    name: props.record?.name || '',
    managerName: props.record?.managerName || currentUser.value?.fullName,
    game: props.record?.game,
    previousId: props.record?.previousId,
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
    return props.record ? { id: props.record.id, attributes } : { attributes }
  }

  const router = useRouter()
  const { form, formIsLoading, submitForm } = useForm({
    mutation,
    variables,
    onSuccess(data: { team: { id: number } }[]) {
      const team = Object.values(data)[0].team
      router.push(`/teams/${team.id}`)
    }
  })

  const teamRepo = useRepo(Team)
  const teams = computed(() =>
    teamRepo
      .where('id', (id: number) => id !== props.record?.id)
      .orderBy('createdAt', 'desc')
      .get()
  )
  watch(
    () => attributes.previousId,
    () => {
      if (attributes.previousId) {
        const prevTeam = teamRepo.find(attributes.previousId)
        if (prevTeam) {
          attributes.game = prevTeam.game
          attributes.managerName = prevTeam.managerName
          if (!props.record) {
            attributes.startedOn = prevTeam.currentlyOn
            attributes.currentlyOn = prevTeam.currentlyOn
          }
        }
      }
    }
  )
</script>

<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <team-combobox v-model="attributes.name" label="Name" />
    <v-autocomplete
      v-model="attributes.previousId"
      label="Previous Team"
      :items="teams"
      item-value="id"
      item-title="name"
      clearable
    >
      <template #selection="{ item }">
        {{ item.raw.name }} ·
        {{ item.raw.game || formatDate(item.raw.currentlyOn) }}
      </template>
      <template #item="{ item, props: itemProps }">
        <v-list-item
          v-bind="itemProps"
          :subtitle="`${item.raw.managerName} · ${
            item.raw.game || formatDate(item.raw.currentlyOn)
          }`"
        />
      </template>
    </v-autocomplete>
    <v-text-field v-model="attributes.managerName" label="Manager Name" />
    <v-text-field v-model="attributes.game" label="Game" />
    <date-field v-model="attributes.startedOn" label="Start Date" />
    <date-field v-model="attributes.currentlyOn" label="Current Date" />
    <v-text-field v-model="attributes.currency" label="Currency" />
    <v-btn type="submit" :loading="formIsLoading">
      {{ props.record ? 'Update' : 'Create' }}
    </v-btn>
  </v-form>
</template>

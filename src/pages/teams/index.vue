<script setup>
  import { format, parseISO } from 'date-fns'
  import { useNavigationStore } from '~/store/navigation'
  import { Team } from '~/models'
  import { teamFragment } from '~/fragments'

  const { data } = await useQuery({
    query: gql`
      query fetchTeams {
        teams { ...TeamData }
      }
      ${teamFragment}
    `
  })

  const teamRepo = useRepo(Team)
  watchEffect(() => {
    if (data.value?.teams) {
      teamRepo.save(data.value?.teams)
    }
  })

  const navigationStore = useNavigationStore()
  onMounted(() => {
    navigationStore.setBreadcrumbs([
      { icon: 'mdi-home', to: '/' },
      { label: 'Teams', to: '/teams' }
    ])
  })

  const teams = computed(() => teamRepo.orderBy('id', 'desc').get())

  const columns = [
    { name: 'name', field: 'name', label: 'Name', sortable: true, align: 'center' },
    { name: 'badge', field: 'badgeUrl', label: 'Badge', align: 'center' },
    { name: 'startedOn', field: 'startedOn', label: 'Start Date', sortable: true, align: 'center' },
    { name: 'currentlyOn', field: 'currentlyOn', label: 'Current Date', sortable: true, align: 'center' }
  ]
</script>

<template>
  <q-table
    title="Teams"
    :rows="teams"
    :columns="columns"
    row-key="id"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <q-btn
          :to="`/teams/${props.row.id}`"
          :label="props.value"
          color="primary"
          flat
        />
      </q-td>
    </template>
    <template #body-cell-badge="props">
      <q-td :props="props">
        <q-img
          :src="props.value"
          width="32px"
          height="32px"
          fit="contain"
        />
      </q-td>
    </template>
    <template #body-cell-startedOn="props">
      <q-td :props="props">
        {{ format(parseISO(props.value), 'MMM dd, yyyy') }}
      </q-td>
    </template>
    <template #body-cell-currentlyOn="props">
      <q-td :props="props">
        {{ format(parseISO(props.value), 'MMM dd, yyyy') }}
      </q-td>
    </template>
  </q-table>
</template>

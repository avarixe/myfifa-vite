<script setup>
  import { Team } from '~/models'

  const { data } = await useQuery({
    query: gql`
      query fetchTeams {
        teams { ...TeamData }
      }
      ${teamFragment}
    `
  })

  const teamRepo = useRepo(Team)
  teamRepo.save(data.value.teams)

  const teams = computed(() => teamRepo.orderBy('id', 'desc').get())

  const columns = [
    { name: 'name', field: 'name', label: 'Name', align: 'left', sortable: true },
    { name: 'badgeUrl', field: 'badgeUrl', label: 'Badge', align: 'center' },
    {
      name: 'startedOn',
      field: 'startedOn',
      label: 'Start Date',
      align: 'center',
      sortable: true,
      format: (value, _row) => formatDate(value)
    },
    {
      name: 'currentlyOn',
      field: 'currentlyOn',
      label: 'Current Date',
      align: 'center',
      sortable: true,
      format: (value, _row) => formatDate(value)
    }
  ]
</script>

<template>
  <h3 class="text-h3">Teams</h3>

  <q-btn
    to="/teams/new"
    icon="mdi-plus"
    label="Team"
  />

  <q-table
    :columns="columns"
    :rows="teams"
    class="mt-4"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <q-btn
          flat
          color="primary"
          :to="`/teams/${props.row.id}`"
          :label="props.value"
        />
      </q-td>
    </template>
    <template #body-cell-badgeUrl="props">
      <q-td :props="props">
        <img :src="props.value" width="50" />
      </q-td>
    </template>
  </q-table>
</template>

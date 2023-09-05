<script setup lang="ts">
  import { Team } from '~/models'

  const { data } = await useQuery({
    query: gql`
      query fetchTeams {
        teams {
          ...TeamData
        }
      }
      ${teamFragment}
    `
  })

  const teamRepo = useRepo(Team)
  teamRepo.save(data.value.teams)

  const teams = computed(() => teamRepo.orderBy('id', 'desc').get())

  const headers: TableHeader[] = [
    { key: 'badgeUrl', title: 'Badge', align: 'center', sortable: false },
    { key: 'name', title: 'Name' },
    { key: 'managerName', title: 'Manager' },
    { key: 'game', title: 'Game' },
    { key: 'startedOn', title: 'Start Date', align: 'center' },
    { key: 'currentlyOn', title: 'Current Date', align: 'center' },
    { key: 'createdAt', title: 'Created At', align: 'center' }
  ]

  const sortBy: Ref<TableSortItem[]> = ref([
    { key: 'createdAt', order: 'desc' }
  ])
</script>

<template>
  <div class="text-h4">Teams</div>

  <v-btn to="/teams/new" class="my-2">
    <v-icon start>mdi-plus</v-icon>
    Team
  </v-btn>

  <v-data-table
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="teams"
    class="rounded"
  >
    <template #[`item.badgeUrl`]="{ item }">
      <v-avatar>
        <v-img :src="item.raw.badgeUrl" />
      </v-avatar>
    </template>
    <template #[`item.name`]="{ item }">
      <v-btn
        :to="`/teams/${item.raw.id}`"
        :text="item.raw.name"
        variant="text"
        color="primary"
        class="text-capitalize"
      />
    </template>
    <template #[`item.startedOn`]="{ item }">
      {{ formatDate(item.raw.startedOn) }}
    </template>
    <template #[`item.currentlyOn`]="{ item }">
      {{ formatDate(item.raw.currentlyOn) }}
    </template>
    <template #[`item.createdAt`]="{ item }">
      {{ formatDate(item.raw.createdAt, 'yyyy-MM-dd hh:mm a') }}
    </template>
  </v-data-table>
</template>

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

  const headers = [
    { value: 'badgeUrl', text: 'Badge', align: 'center', sortable: false },
    { value: 'name', text: 'Name' },
    { value: 'managerName', text: 'Manager' },
    { value: 'game', text: 'Game' },
    { value: 'startedOn', text: 'Start Date', align: 'center' },
    { value: 'currentlyOn', text: 'Current Date', align: 'center' },
    { value: 'createdAt', text: 'Created At', align: 'center' }
  ]
</script>

<template>
  <div class="text-h4">Teams</div>

  <v-btn to="/teams/new" class="my-2">
    <v-icon start>mdi-plus</v-icon>
    Team
  </v-btn>

  <data-table
    :headers="headers"
    :items="teams"
    item-key="id"
    sort-by="createdAt"
    sort-desc
  >
    <template #item-badgeUrl="{ item }">
      <img :src="item.badgeUrl" width="50" />
    </template>
    <template #item-name="{ item }">
      <v-btn
        :to="`/teams/${item.id}`"
        :text="item.name"
        variant="text"
        color="primary"
        class="text-capitalize"
      />
    </template>
    <template #item-startedOn="{ item }">
      {{ formatDate(item.startedOn) }}
    </template>
    <template #item-currentlyOn="{ item }">
      {{ formatDate(item.currentlyOn) }}
    </template>
    <template #item-createdAt="{ item }">
      {{ formatDate(item.createdAt, 'yyyy-MM-dd hh:mm a') }}
    </template>
  </data-table>
</template>

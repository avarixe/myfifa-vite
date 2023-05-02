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
    { value: 'name', text: 'Name' },
    { value: 'badgeUrl', text: 'Badge', class: 'text-center', sortable: false },
    { value: 'startedOn', text: 'Start Date', class: 'text-center' },
    { value: 'currentlyOn', text: 'Current Date', class: 'text-center' }
  ]
</script>

<template>
  <div class="text-h4">Teams</div>

  <v-btn to="/teams/new" class="my-2">
    <v-icon start>mdi-plus</v-icon>
    Team
  </v-btn>

  <data-table :headers="headers" :items="teams" item-key="id" sort-desc>
    <template #item="{ item: team }">
      <td>
        <v-btn variant="text" color="primary" :to="`/teams/${team.id}`">
          {{ team.name }}
        </v-btn>
      </td>
      <td class="text-center"><img :src="team.badgeUrl" width="50" /></td>
      <td class="text-center">{{ formatDate(team.startedOn) }}</td>
      <td class="text-center">{{ formatDate(team.currentlyOn) }}</td>
    </template>
  </data-table>
</template>

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

  const headers = [
    { value: 'name', text: 'Name' },
    { value: 'badgeUrl', text: 'Badge', sortable: false },
    { value: 'startedOn', text: 'Start Date' },
    { value: 'currentlyOn', text: 'Current Date' }
  ]

</script>

<template>
  <h1>Teams</h1>

  <v-btn to="/teams/new">
    <v-icon start>mdi-plus</v-icon>
    Team
  </v-btn>

  <data-table
    :headers="headers"
    :items="teams"
    item-key="id"
    sort-desc
  >
    <template #item="{ item: team }">
      <td>
        <v-btn
          variant="text"
          color="primary"
          :to="`/teams/${team.id}`"
          v-text="team.name"
        />
      </td>
      <td><img :src="team.badgeUrl" width="50" /></td>
      <td>{{ formatDate(team.startedOn) }}</td>
      <td>{{ formatDate(team.currentlyOn) }}</td>
    </template>
  </data-table>
</template>

<script setup>
  import { formatDate } from '~/filters'
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
  teamRepo.save(data.value.teams)

  const teams = computed(() => teamRepo.orderBy('id', 'desc').get())
</script>

<template>
  <h1>Teams</h1>

  <v-btn to="/teams/new">
    <v-icon left>mdi-plus</v-icon>
    Team
  </v-btn>

  <v-table>
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Badge</th>
        <th class="text-left">Start Date</th>
        <th class="text-left">Current Date</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="team in teams"
        :key="team.id"
      >
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
      </tr>
    </tbody>
  </v-table>
</template>

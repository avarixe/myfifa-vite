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
  <table>
    <thead>
      <th>Name</th>
      <th>Badge</th>
      <th>Start Date</th>
      <th>Current Date</th>
    </thead>
    <tbody>
      <tr
        v-for="team in teams"
        :key="team.id"
      >
        <td>
          <router-link :to="`/teams?id=${team.id}`">{{ team.name }}</router-link>
        </td>
        <td><img :src="team.badgeUrl" width="50" /></td>
        <td>{{ formatDate(team.startedOn) }}</td>
        <td>{{ formatDate(team.currentlyOn) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { format, parseISO } from 'date-fns'
  import { useNavigationStore } from '~/store/navigation'
  import { Team } from '~/models'
  import { teamFragment } from '~/fragments'

  const { data } = useQuery({
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

  const teams = computed(() => teamRepo.all())

  const { breadcrumbs } = useNavigationStore()
  onMounted(() => {
    breadcrumbs.value = [

    ]
  })
</script>

<template>
  <table :style="{ width: '100%' }">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Start Date</th>
        <th>Current Date</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="team in teams"
        :key="team.id"
        :style="{ textAlign: 'center' }"
      >
        <td>{{ team.id }}</td>
        <td>
          <router-link :to="`/teams/${team.id}`">
            {{ team.name }}
          </router-link>
        </td>
        <!-- <td>{{ format(parseISO(team.startedOn), 'MMM dd, yyyy') }}</td> -->
        <td>{{ team.startedOn }}</td>
        <!-- <td>{{ format(parseISO(team.currentlyOn), 'MMM dd, yyyy') }}</td> -->
        <td>{{ team.currentlyOn }}</td>
      </tr>
    </tbody>
  </table>
</template>

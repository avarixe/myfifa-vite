<script setup>
  import { computed } from 'vue'
  import { useQuery } from '@urql/vue'
  import gql from 'graphql-tag'
  import { format, parseISO } from 'date-fns'
  import { teamFragment } from '~/fragments'

  const { data } = useQuery({
    query: gql`
      query fetchTeams {
        teams { ...TeamData }
      }
      ${teamFragment}
    `
  })

  const teams = computed(() => data.value?.teams || [])
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
        <td>{{ format(parseISO(team.startedOn), 'MMM dd, yyyy') }}</td>
        <td>{{ format(parseISO(team.currentlyOn), 'MMM dd, yyyy') }}</td>
      </tr>
    </tbody>
  </table>
</template>

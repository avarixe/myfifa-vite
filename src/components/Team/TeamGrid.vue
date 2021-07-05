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
      >
        <td>{{ team.id }}</td>
        <td>{{ team.name }}</td>
        <td>{{ format(parseISO(team.startedOn), 'MMM dd, yyyy') }}</td>
        <td>{{ format(parseISO(team.currentlyOn), 'MMM dd, yyyy') }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { computed } from 'vue'
  import { useQuery } from '@urql/vue'
  import { format, parseISO } from 'date-fns'

  const { data } = useQuery({
    query: `
      {
        teams {
          id
          name
          startedOn
          currentlyOn
        }
      }
    `
  })

  const teams = computed(() => data.value?.teams || [])
</script>

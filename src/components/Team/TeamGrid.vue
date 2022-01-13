<script setup>
  import { format, parseISO } from 'date-fns'

  defineProps({
    teams: { type: Array, required: true }
  })

  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Start Date', key: 'startedOn' },
    { label: 'Current Date', key: 'currentlyOn' }
  ]
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

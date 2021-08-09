<template>
  <w-table
    :headers="headers"
    :items="teams"
    class="mx4"
  >
    <template #item="{ item: team, classes }">
      <tr :class="classes">
        <td class="px2 py1">{{ team.id }}</td>
        <td class="px2 py1">
          <router-link :to="`/teams/${team.id}`">{{ team.name }}</router-link>
        </td>
        <td class="px2 py1">
          {{ format(parseISO(team.startedOn), 'MMM dd, yyyy') }}
        </td>
        <td class="px2 py1">
          {{ format(parseISO(team.currentlyOn), 'MMM dd, yyyy') }}
        </td>
      </tr>
    </template>
  </w-table>
</template>

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

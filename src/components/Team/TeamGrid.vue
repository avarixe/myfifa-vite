<template>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="team in teams"
        :key="team.id"
      >
        <td>{{ team.id }}</td>
        <td>{{ team.name }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  import { computed } from 'vue'
  import { useQuery } from 'vql'

  const { data } = useQuery()

  const teams = computed(() => data.value?.teams || [])
</script>

<gql>
  {
    teams {
      id
      name
    }
  }
</gql>

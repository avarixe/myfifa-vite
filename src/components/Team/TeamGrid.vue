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
  const teams = []
</script>

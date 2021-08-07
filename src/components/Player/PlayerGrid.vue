<template>
  <table :style="{ width: '100%' }">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Position</th>
        <th>OVR</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="player in players"
        :key="player.id"
        :style="{ textAlign: 'center' }"
      >
        <td>{{ player.id }}</td>
        <td>{{ player.name }}</td>
        <td>{{ player.pos }}</td>
        <td>{{ player.ovr }}</td>
        <td>{{ player.value }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  defineProps({
    players: { type: Array, required: true }
  })
</script>

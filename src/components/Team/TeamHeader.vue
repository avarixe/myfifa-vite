<script setup>
  const props = defineProps({
    team: { type: Object, required: true }
  })
</script>

<template>
  <h1>
    <router-link :to="`/teams/${team.id}`">{{ team.name }}</router-link>
  </h1>
  <hr>
</template>

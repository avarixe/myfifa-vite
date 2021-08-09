<template>
  <router-link to="/teams">Teams</router-link>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()
  router.push('/teams')
</script>

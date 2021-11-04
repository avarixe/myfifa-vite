<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()
  router.push('/teams')
</script>

<template>
  <router-link to="/teams">Teams</router-link>
</template>

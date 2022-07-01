<script setup>
  import { useNavigationStore } from '~/store/navigation'

  const navigationStore = useNavigationStore()
  onMounted(() => {
    navigationStore.$reset()
  })
</script>

<template>
  <router-link to="/teams">View All Teams</router-link>
</template>

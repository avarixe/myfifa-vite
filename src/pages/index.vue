<script setup>
  import { useNavigationStore } from '~/store/navigation'

  const navigationStore = useNavigationStore()
  onMounted(() => {
    navigationStore.$reset()
  })
</script>

<template>
  <router-link to="/teams">Teams</router-link>
  <router-link to="/account">Account</router-link>
</template>

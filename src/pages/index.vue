<template>
  <router-link to="/teams">Teams</router-link>
</template>

<script setup>
  import { toRefs } from 'vue'
  import { useAuthStore } from '~/store/auth'

  const { logout } = toRefs(useAuthStore())
</script>

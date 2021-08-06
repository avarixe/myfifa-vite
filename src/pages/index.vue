<template>
  Logged In!

  <button @click="logout">Log Out</button>
</template>

<script setup>
  import { toRefs } from 'vue'
  import { useAuthStore } from '~/store/auth'

  const { logout } = toRefs(useAuthStore())
</script>

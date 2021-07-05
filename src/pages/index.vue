<template>
  Logged In!

  <button @click="logout">Log Out</button>
</template>

<script setup>
  import { toRefs } from 'vue'
  import { useMainStore } from '~/store/main'

  const { logout } = toRefs(useMainStore())
</script>

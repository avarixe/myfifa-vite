<script setup>
  import { useNavStore } from '~/store/nav'

  useNavStore().$reset()
</script>

<template>
  <v-btn to="/teams">View All Teams</v-btn>
</template>

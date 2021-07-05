<template>
  <h1>MyFIFA Manager Index</h1>

  <section v-if="token">
    Logged In!

    <team-grid />

    <button @click="logout">Log Out</button>
  </section>
  <section v-else>
    <login-form />
  </section>
</template>

<script setup>
  import { toRefs } from 'vue'
  import { useMainStore } from '~/store/main'
  import LoginForm from '~/components/App/LoginForm.vue'
  import TeamGrid from '~/components/Team/TeamGrid.vue'

  const { token, logout } = toRefs(useMainStore())
</script>

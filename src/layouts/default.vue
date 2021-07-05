<template>
  <template v-if="token">
    <h1>MyFIFA Manager</h1>
    <button @click="logout">Log Out</button>
    <main>
      <router-view />
    </main>
  </template>
  <template v-else>
    <main>
      <h1>MyFIFA Manager</h1>
      <login-form />
    </main>
  </template>
</template>

<script setup>
  import { toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMainStore } from '~/store/main'
  import LoginForm from '~/components/App/LoginForm.vue'

  const { token, logout } = toRefs(useMainStore())

  const router = useRouter()
  token && router.push('/teams')
</script>

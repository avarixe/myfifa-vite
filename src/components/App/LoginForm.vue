<template>
  <div>
    <label>Username</label>
    <input v-model="username" />
  </div>
  <div>
    <label>Password</label>
    <input v-model="password" type="password" />
  </div>
  <div>
    <button @click="login(username, password)">Login</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useMainStore } from '~/store/main'

  const username = ref('')
  const password = ref('')

  const { login } = useMainStore()
</script>

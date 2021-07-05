<template>
  <h1>MyFIFA Manager Index</h1>

  <section v-if="token">
    Logged In!

    <team-grid />
  </section>
  <section v-else>
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
  </section>
</template>

<script setup>
  import { ref } from 'vue'
  import { useMainStore } from '~/store/main'

  const username = ref('')
  const password = ref('')

  const { token, login } = useMainStore()
</script>

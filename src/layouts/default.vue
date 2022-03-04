<script setup>
  import { useAuthStore } from '~/store/auth'

  const authStore = useAuthStore()
  const token = computed(() => authStore.token)

  const router = useRouter()
  const route = useRoute()
  watch(token, () => {
    if (token.value) {
      if (route.name === 'login') {
        router.push('/')
      }
    } else if (route.name !== 'login') {
      router.push('/login')
    }
  }, { immediate: true })
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <app-bar v-if="token" />
    </q-header>
    <q-page-container>
      <q-page padding>
        <suspense>
          <router-view />
        </suspense>
      </q-page>
    </q-page-container>
    <q-footer>
    </q-footer>
  </q-layout>
</template>

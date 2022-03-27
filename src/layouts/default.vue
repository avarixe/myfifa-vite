<script setup>
  import { useAuthStore } from '~/store/auth'
  import { useNavigationStore } from '~/store/navigation'
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

  const navigationStore = useNavigationStore()
  const breadcrumbs = computed(() => navigationStore.breadcrumbs)
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <app-bar v-if="token" />
    </q-header>
    <q-page-container>
      <q-toolbar
        v-if="breadcrumbs.length > 0"
        inset
      >
        <q-breadcrumbs>
          <q-breadcrumbs-el
            v-for="(breadcrumb, i) in breadcrumbs"
            :key="i"
            v-bind="breadcrumb"
          />
        </q-breadcrumbs>
      </q-toolbar>
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

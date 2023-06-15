<script setup lang="ts">
  useHead({
    title: __APP_TITLE__
  })

  const route = useRoute<'/auth/[credentials]'>()
  const { sessionStore } = useSession()
  onMounted(() => {
    const credentials = JSON.parse(atob(route.params.credentials))
    sessionStore.token = credentials.token
    sessionStore.userId = parseInt(credentials.user_id)
    window.location = sessionStore.redirectUrl || '/'
  })
</script>

<template>
  <div
    class="d-flex align-center justify-center"
    :style="{ minHeight: '90vh' }"
  >
    <div class="text-center mb-4">
      <app-entry-header />
    </div>
    <div class="text-center">Signing In...</div>
  </div>
</template>

export default () => {
  const authStore = useAuthStore()

  const token = computed(() => authStore.token)
  const { setToken, clearToken } = authStore

  return {
    token,
    setToken,
    clearToken,
    authStore
  }
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    token: useStorage('token', null as string | null),
    userId: null as number | null,
    redirectUrl: null as string | null
  }),
  actions: {
    clearSession(): void {
      this.token = null
      this.userId = null
      this.redirectUrl = null
    }
  }
})

export const useSessionStore = defineStore('session', {
  state: () => ({
    token: useStorage('token', null),
    userId: null,
    redirectUrl: null
  }),
  actions: {
    clearSession(): void {
      this.token = null
      this.userId = null
      this.redirectUrl = null
    }
  }
})

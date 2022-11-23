export const useAuthStore = defineStore('auth', {
  state: () => ({
    // token: localStorage.getItem('token'),
    token: null,
    userId: null,
    redirectUrl: null
  }),
  actions: {
    setToken (token) {
      // localStorage.setItem('token', token)
      this.token = token
    },
    clearToken () {
      // localStorage.removeItem('token')
      this.token = null
      this.userId = null
      this.redirectUrl = null
    }
  }
})

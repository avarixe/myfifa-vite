import { useStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useStorage('token'),
    userId: null,
    redirectUrl: null
  }),
  actions: {
    setToken (token) {
      this.token = token
    },
    clearToken () {
      this.token = null
      this.userId = null
      this.redirectUrl = null
    }
  }
})

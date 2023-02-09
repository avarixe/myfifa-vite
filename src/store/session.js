import { useStorage } from '@vueuse/core'

export const useSessionStore = defineStore('session', {
  state: () => ({
    token: useStorage('token'),
    userId: null,
    redirectUrl: null
  }),
  actions: {
    clearSession () {
      this.token = null
      this.userId = null
      this.redirectUrl = null
    }
  }
})

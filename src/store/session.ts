import { RemovableRef } from '@vueuse/core'

interface SessionState {
  token: RemovableRef<string | null>
  userId: number | null
  redirectUrl: string | null
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    token: useStorage<string | null>('token', null),
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

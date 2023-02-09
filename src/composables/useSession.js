import { User } from '~/models'

export default () => {
  const sessionStore = useSessionStore()

  const token = computed(() => sessionStore.token)
  const { clearSession } = sessionStore

  const userRepo = useRepo(User)
  const currentUser = computed(() => userRepo.find(parseInt(sessionStore.userId)))

  return {
    token,
    currentUser,
    clearSession,
    sessionStore
  }
}

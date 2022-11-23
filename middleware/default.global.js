import axios from 'axios'

export default defineNuxtRouteMiddleware(async to => {
  const { token, authStore } = useToken()
  if (token.value) {
    // check if user is authenticated
    if (!authStore.userId) {
      const { data: { data } } =
        await axios.post(`${import.meta.env.VITE_API_URL}/graphql`, {
          query: gql`
            query fetchUser {
              user { ...UserData }
            }
            ${userFragment}
          `.loc.source.body
        }, { headers: { authorization: `Bearer ${token.value}` } })
      if (data.user) {
        await useRepo(User).save(data.user)
        authStore.userId = parseInt(data.user.id)
      } else {
        authStore.clearToken()
        authStore.redirectUrl = to
        return '/login'
      }
    }

    if (to.name === 'login') {
      return authStore.redirectUrl || '/'
    }
  } else if (to.name !== 'login') {
    authStore.redirectUrl = to
    return '/login'
  }
})

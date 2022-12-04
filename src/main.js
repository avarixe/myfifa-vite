import { ViteSSG } from 'vite-ssg'

import { createORM } from 'pinia-orm'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

import App from './App.vue'
import { User } from '~/models'

const routes = setupLayouts(generatedRoutes)

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router }) => {
    const pinia = createPinia().use(createORM())
    app.use(pinia)

    const vuetify = createVuetify({ directives })
    app.use(vuetify)

    router.beforeEach(async (to) => {
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
  }
)

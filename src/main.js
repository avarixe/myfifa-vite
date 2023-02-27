import { createORM } from 'pinia-orm'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

import App from './App.vue'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import VueApexCharts from 'vue3-apexcharts'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async to => {
  const { token, sessionStore } = useSession()
  if (token.value) {
    // check if user is authenticated
    if (!sessionStore.userId) {
      const {
        data: { data }
      } = await axios.post(
        `${import.meta.env.VITE_API_URL}/graphql`,
        {
          query: gql`
            query fetchUser {
              user {
                ...UserData
              }
            }
            ${userFragment}
          `.loc.source.body
        },
        { headers: { authorization: `Bearer ${token.value}` } }
      )
      if (data.user) {
        await useRepo(User).save(data.user)
        sessionStore.userId = parseInt(data.user.id)
      } else {
        sessionStore.clearSession()
        sessionStore.redirectUrl = to
        return '/login'
      }
    }

    if (['login', 'register'].includes(to.name)) {
      return sessionStore.redirectUrl || '/'
    }
  } else if (!['login', 'register'].includes(to.name)) {
    sessionStore.redirectUrl = to
    return '/login'
  }
})

const pinia = createPinia().use(createORM())

const vuetify = createVuetify({ directives })

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .use(VueApexCharts)

app.component('date-picker', Datepicker)

app.mount('#app')

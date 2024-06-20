import 'vuetify/styles'
import '@vuepic/vue-datepicker/dist/main.css'

import VueDatePicker from '@vuepic/vue-datepicker'
import { createHead } from '@vueuse/head'
import { createORM } from 'pinia-orm'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { createVuetify } from 'vuetify'

import App from './App.vue'
import { User } from './models'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async to => {
  const { token, sessionStore } = useSession()
  if (token.value) {
    // check if user is authenticated
    if (!sessionStore.userId) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/graphql`, {
        method: 'POST',
        body: JSON.stringify({
          query: gql`
            query fetchUser {
              user {
                ...UserData
              }
            }
            ${userFragment}
          `?.loc?.source?.body
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`
        }
      })
      const { data } = await response.json()
      if (data.user) {
        await useRepo(User).save(data.user)
        sessionStore.userId = Number(data.user.id)
      } else {
        sessionStore.clearSession()
        sessionStore.redirectUrl = to.fullPath
        return '/login'
      }
    }

    if (['/login', '/register'].includes(String(to.name))) {
      return sessionStore.redirectUrl || '/'
    }
  } else if (!['/login', '/register'].includes(String(to.name))) {
    sessionStore.redirectUrl = to.fullPath
    return '/login'
  }
})

const pinia = createPinia().use(createORM())

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  defaults: {
    VDataTable: {
      fixedHeader: true,
      hover: true
    },
    VDataTableVirtual: {
      fixedHeader: true,
      hover: true
    },
    VDataTableServer: {
      fixedHeader: true,
      hover: true
    }
  }
})

const head = createHead()

const app = createApp(App).use(router).use(pinia).use(head).use(vuetify)

app.component('vue-date-picker', VueDatePicker)

app.mount('#app')

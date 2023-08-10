import { createORM } from 'pinia-orm'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { createHead } from '@vueuse/head'

import { createVuetify } from 'vuetify'
import {
  VDataTable,
  VDataTableVirtual,
  VDataTableServer
} from 'vuetify/labs/VDataTable'
import 'vuetify/styles'

import { User } from './models'
import App from './App.vue'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const router = createRouter({
  history: createWebHistory()
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

    if (['/login', '/register'].includes(to.name?.toString())) {
      return sessionStore.redirectUrl || '/'
    }
  } else if (!['/login', '/register'].includes(to.name?.toString())) {
    sessionStore.redirectUrl = to
    return '/login'
  }
})

const pinia = createPinia().use(createORM())

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  components: {
    VDataTable,
    VDataTableVirtual,
    VDataTableServer
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

app.component('date-picker', Datepicker)

app.mount('#app')

import { createORM } from 'pinia-orm'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/svg-mdi-v6'

import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/mdi-v6/mdi-v6.css'
import 'quasar/src/css/index.sass'

import 'uno.css'

import App from './App.vue'
import { User } from '~/models'

import VueApexCharts from 'vue3-apexcharts'

const router = createRouter({
  history: createWebHistory(),
  routes
})

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
        await useRepo(User).save({ ...data.user, id: parseInt(data.user.id) })
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

const pinia = createPinia().use(createORM())

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(Quasar, {
    plugins: {},
    iconSet: quasarIconSet
  })
  .use(VueApexCharts)

app.mount('#app')

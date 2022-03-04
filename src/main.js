import PiniaORM from 'pinia-orm'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'

import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/svg-mdi-v6'
import 'quasar/dist/quasar.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/mdi-v6/mdi-v6.css'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
  .use(PiniaORM.install())

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(Quasar, {
    plugins: {},
    iconSet: quasarIconSet
  })

app.mount('#app')

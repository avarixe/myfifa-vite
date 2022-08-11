import { createORM } from 'pinia-orm'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

import { createVuetify } from 'vuetify'
import 'vuetify/styles'

import App from './App.vue'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia().use(createORM())

const vuetify = createVuetify()

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)

app.mount('#app')

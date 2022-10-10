import { createORM } from 'pinia-orm'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia().use(createORM())

const vuetify = createVuetify({ directives })

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(vuetify)
  .use(VueApexCharts)

app.mount('#app')

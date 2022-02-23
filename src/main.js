import PiniaORM from 'pinia-orm'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'

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

app.mount('#app')

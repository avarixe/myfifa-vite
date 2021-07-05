import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async login (username, password) {
      const { data } = await axios({
        baseURL: import.meta.env.VITE_API_URL,
        url: 'oauth/token',
        method: 'post',
        data: {
          username,
          password,
          grant_type: 'password',
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET
        },
      })
      this.token = data.access_token
      localStorage.setItem('token', data.access_token)
    },
    async logout () {
      await axios({
        baseURL: import.meta.env.VITE_API_URL,
        url: 'oauth/revoke',
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        data: {
          client_id: import.meta.env.VITE_CLIENT_ID,
          client_secret: import.meta.env.VITE_CLIENT_SECRET
        }
      })
      this.token = null
      localStorage.removeItem('token')
    }
  }
})

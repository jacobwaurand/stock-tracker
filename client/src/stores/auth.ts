// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    email: '',
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email: string, password: string) {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        this.token = data.token
        this.email = email
        localStorage.setItem('token', data.token)
      }

      return data
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
  },
})

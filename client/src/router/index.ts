import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/components/views/HomeView.vue'
import LoginView from '@/components/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView, meta: { requiresAuth: false } },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated // or however you track auth state

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to home if user is already logged in
    next('/home')
  } else {
    next()
  }
})

export default router

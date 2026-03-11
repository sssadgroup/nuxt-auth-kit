// src/runtime/middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app'
import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const store = useAuthStore()
  const config = useRuntimeConfig()
  const opts = config.public.nuxtAuthKit as any
  const loginPath = opts?.redirects?.login || '/auth/login'

  if (!store.isAuthenticated) {
    return navigateTo({
      path: loginPath,
      query: { redirect: to.fullPath }
    })
  }
})

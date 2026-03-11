// src/runtime/plugins/auth.ts
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#app'
import { useAuthStore } from '../stores/auth'
import { useAuth } from '../composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useAuthStore()
  const config = useRuntimeConfig()
  const opts = config.public.nuxtAuthKit as any
  const tokenCookieName = opts?.tokenCookieName || 'auth_token'
  const tokenCookie = useCookie<string | null>(tokenCookieName)

  // Restore token from cookie on app boot
  if (tokenCookie.value && !store.token) {
    store.setToken(tokenCookie.value)
    // Fetch user info to restore session
    try {
      const { fetchUser } = useAuth()
      await fetchUser()
    } catch (_) {
      store.clearAuth()
      tokenCookie.value = null
    }
  }
})

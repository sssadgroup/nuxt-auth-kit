// src/runtime/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser } from '../types'

export const useAuthStore = defineStore('nuxt-auth-kit', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isGuest = computed(() => !isAuthenticated.value)

  function hasRole(role: string | string[]): boolean {
    if (!user.value?.roles) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.some(r => user.value!.roles!.includes(r))
  }

  function hasPermission(permission: string | string[]): boolean {
    if (!user.value?.permissions) return false
    const perms = Array.isArray(permission) ? permission : [permission]
    return perms.some(p => user.value!.permissions!.includes(p))
  }

  function setUser(userData: AuthUser) {
    user.value = userData
  }

  function setToken(tokenValue: string) {
    token.value = tokenValue
  }

  function clearAuth() {
    user.value = null
    token.value = null
  }

  function setLoading(state: boolean) {
    loading.value = state
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isGuest,
    hasRole,
    hasPermission,
    setUser,
    setToken,
    clearAuth,
    setLoading
  }
}, {
  persist: false
})

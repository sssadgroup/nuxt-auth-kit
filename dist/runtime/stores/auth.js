import { defineStore } from "pinia";
import { ref, computed } from "vue";
export const useAuthStore = defineStore(
  "nuxt-auth-kit",
  () => {
    const user = ref(null);
    const token = ref(null);
    const loading = ref(false);
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const isGuest = computed(() => !isAuthenticated.value);
    function hasRole(role) {
      if (!user.value?.roles) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.some((r) => user.value.roles.includes(r));
    }
    function hasPermission(permission) {
      if (!user.value?.permissions) return false;
      const perms = Array.isArray(permission) ? permission : [permission];
      return perms.some((p) => user.value.permissions.includes(p));
    }
    function setUser(userData) {
      user.value = userData;
    }
    function setToken(tokenValue) {
      token.value = tokenValue;
    }
    function clearAuth() {
      user.value = null;
      token.value = null;
    }
    function setLoading(state) {
      loading.value = state;
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
    };
  },
  {
    persist: false
  }
);

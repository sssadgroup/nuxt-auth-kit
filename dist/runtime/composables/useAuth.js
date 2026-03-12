import { useRuntimeConfig, navigateTo, useCookie } from "#app";
import { useAuthStore } from "../stores/auth.js";
export function useAuth() {
  const store = useAuthStore();
  const config = useRuntimeConfig();
  const opts = config.public.nuxtAuthKit;
  const apiBase = opts?.apiBase || "";
  const endpoints = {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    updateProfile: "/api/auth/profile",
    updatePassword: "/api/auth/password",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    ...opts?.endpoints || {}
  };
  const redirects = {
    login: "/auth/login",
    home: "/",
    afterLogout: "/auth/login",
    ...opts?.redirects || {}
  };
  const tokenCookieName = opts?.tokenCookieName || "auth_token";
  const tokenCookie = useCookie(tokenCookieName, {
    default: () => null,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7
    // 7 days
  });
  async function apiFetch(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers || {}
    };
    if (store.token) {
      headers["Authorization"] = `Bearer ${store.token}`;
    }
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers
    });
    const data = await response.json();
    if (!response.ok) {
      const error = {
        message: data.message || "Une erreur est survenue",
        errors: data.errors
      };
      throw error;
    }
    return data;
  }
  function persistToken(token) {
    store.setToken(token);
    tokenCookie.value = token;
  }
  function clearToken() {
    store.clearAuth();
    tokenCookie.value = null;
  }
  async function login(credentials) {
    store.setLoading(true);
    try {
      const data = await apiFetch(endpoints.login, {
        method: "POST",
        body: JSON.stringify(credentials)
      });
      persistToken(data.token);
      store.setUser(data.user);
      await navigateTo(redirects.home);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      store.setLoading(false);
    }
  }
  async function register(data) {
    store.setLoading(true);
    try {
      const response = await apiFetch(endpoints.register, {
        method: "POST",
        body: JSON.stringify(data)
      });
      persistToken(response.token);
      store.setUser(response.user);
      await navigateTo(redirects.home);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      store.setLoading(false);
    }
  }
  async function logout() {
    store.setLoading(true);
    try {
      await apiFetch(endpoints.logout, { method: "POST" });
    } catch (_) {
    } finally {
      clearToken();
      store.setLoading(false);
      await navigateTo(redirects.afterLogout);
    }
  }
  async function fetchUser() {
    if (!store.token && !tokenCookie.value) return null;
    if (!store.token && tokenCookie.value) {
      store.setToken(tokenCookie.value);
    }
    try {
      const data = await apiFetch(endpoints.me);
      store.setUser(data.user || data);
      return store.user;
    } catch (_) {
      clearToken();
      return null;
    }
  }
  async function updateProfile(data) {
    store.setLoading(true);
    try {
      let body;
      let headers = {};
      if (data.avatar instanceof File) {
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (v !== void 0 && v !== null) formData.append(k, v);
        });
        body = formData;
      } else {
        body = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
      }
      const response = await apiFetch(endpoints.updateProfile, {
        method: "PUT",
        body,
        headers
      });
      store.setUser(response.user || response);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      store.setLoading(false);
    }
  }
  async function updatePassword(data) {
    store.setLoading(true);
    try {
      await apiFetch(endpoints.updatePassword, {
        method: "PUT",
        body: JSON.stringify(data)
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      store.setLoading(false);
    }
  }
  async function forgotPassword(data) {
    store.setLoading(true);
    try {
      const response = await apiFetch(
        endpoints.forgotPassword,
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error };
    } finally {
      store.setLoading(false);
    }
  }
  async function resetPassword(data) {
    store.setLoading(true);
    try {
      const response = await apiFetch(
        endpoints.resetPassword,
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error };
    } finally {
      store.setLoading(false);
    }
  }
  const { hasRole, hasPermission } = store;
  return {
    // State
    user: store.user,
    token: store.token,
    loading: store.loading,
    isAuthenticated: store.isAuthenticated,
    isGuest: store.isGuest,
    // RBAC
    hasRole,
    hasPermission,
    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword
  };
}

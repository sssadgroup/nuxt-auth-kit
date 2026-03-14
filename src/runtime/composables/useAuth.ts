import { useNuxtApp, useRuntimeConfig, navigateTo, useCookie } from "#app";
import { useAuthStore } from "../stores/auth";
import type {
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  UpdatePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthResponse,
  ApiError,
} from "../types";

export function useAuth() {
  const nuxtApp = useNuxtApp();
  const store = useAuthStore(nuxtApp.$pinia as any);
  const config = useRuntimeConfig();
  const opts = config.public.nuxtAuthKit as any;

  const apiBase = opts?.apiBase || "";
  const endpoints = {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    updateProfile: "/api/profile",
    updatePassword: "/api/profile/password",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    ...(opts?.endpoints || {}),
  };

  const redirects = {
    login: "/auth/login",
    home: "/",
    afterLogout: "/auth/login",
    ...(opts?.redirects || {}),
  };

  const tokenCookieName = opts?.tokenCookieName || "auth_token";
  const tokenCookie = useCookie<string | null>(tokenCookieName, {
    default: () => null,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // ─── Helpers ───────────────────────────────────────────────────────────────

  async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (store.token) {
      headers["Authorization"] = `Bearer ${store.token}`;
    }

    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || "Une erreur est survenue",
        errors: data.errors,
      };
      throw error;
    }

    return data as T;
  }

  function persistToken(token: string) {
    store.setToken(token);
    tokenCookie.value = token;
  }

  function clearToken() {
    store.clearAuth();
    tokenCookie.value = null;
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async function login(credentials: LoginCredentials) {
    store.setLoading(true);
    try {
      const data = await apiFetch<AuthResponse>(endpoints.login, {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      persistToken(data.token);
      store.setUser(data.user);
      await navigateTo(redirects.home);
      return { success: true };
    } catch (error) {
      return { success: false, error: error as ApiError };
    } finally {
      store.setLoading(false);
    }
  }

  async function register(data: RegisterData) {
    store.setLoading(true);
    try {
      const response = await apiFetch<AuthResponse>(endpoints.register, {
        method: "POST",
        body: JSON.stringify(data),
      });
      persistToken(response.token);
      store.setUser(response.user);
      await navigateTo(redirects.home);
      return { success: true };
    } catch (error) {
      return { success: false, error: error as ApiError };
    } finally {
      store.setLoading(false);
    }
  }

  async function logout() {
    store.setLoading(true);
    try {
      await apiFetch(endpoints.logout, { method: "POST" });
    } catch (_) {
      // Ignore logout API errors - clear locally anyway
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
      const data = await apiFetch<{ user: any }>(endpoints.me);
      store.setUser(data.user || (data as any));
      return store.user;
    } catch (_) {
      clearToken();
      return null;
    }
  }

  async function updateProfile(data: UpdateProfileData) {
    store.setLoading(true);
    try {
      let body: string | FormData;
      let headers: Record<string, string> = {};

      if (data.avatar instanceof File) {
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (v !== undefined && v !== null) formData.append(k, v as any);
        });
        body = formData;
      } else {
        body = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
      }

      const response = await apiFetch<{ user: any }>(endpoints.updateProfile, {
        method: "PUT",
        body,
        headers,
      });
      store.setUser(response.user || (response as any));
      return { success: true };
    } catch (error) {
      return { success: false, error: error as ApiError };
    } finally {
      store.setLoading(false);
    }
  }

  async function updatePassword(data: UpdatePasswordData) {
    store.setLoading(true);
    try {
      await apiFetch(endpoints.updatePassword, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error as ApiError };
    } finally {
      store.setLoading(false);
    }
  }

  async function forgotPassword(data: ForgotPasswordData) {
    store.setLoading(true);
    try {
      const response = await apiFetch<{ message: string }>(
        endpoints.forgotPassword,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error as ApiError };
    } finally {
      store.setLoading(false);
    }
  }

  async function resetPassword(data: ResetPasswordData) {
    store.setLoading(true);
    try {
      const response = await apiFetch<{ message: string }>(
        endpoints.resetPassword,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      );
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error as ApiError };
    } finally {
      store.setLoading(false);
    }
  }

  // ─── RBAC Helpers ──────────────────────────────────────────────────────────

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
    resetPassword,
  };
}

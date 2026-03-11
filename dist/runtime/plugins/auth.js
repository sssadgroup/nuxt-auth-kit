import { defineNuxtPlugin, useCookie, useRuntimeConfig } from "#app";
import { useAuthStore } from "../stores/auth.js";
import { useAuth } from "../composables/useAuth.js";
export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useAuthStore();
  const config = useRuntimeConfig();
  const opts = config.public.nuxtAuthKit;
  const tokenCookieName = opts?.tokenCookieName || "auth_token";
  const tokenCookie = useCookie(tokenCookieName);
  if (tokenCookie.value && !store.token) {
    store.setToken(tokenCookie.value);
    try {
      const { fetchUser } = useAuth();
      await fetchUser();
    } catch (_) {
      store.clearAuth();
      tokenCookie.value = null;
    }
  }
});

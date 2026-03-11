import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#app";
import { useAuthStore } from "../stores/auth.js";
export default defineNuxtRouteMiddleware(() => {
  const store = useAuthStore();
  const config = useRuntimeConfig();
  const opts = config.public.nuxtAuthKit;
  const homePath = opts?.redirects?.home || "/";
  if (store.isAuthenticated) {
    return navigateTo(homePath);
  }
});

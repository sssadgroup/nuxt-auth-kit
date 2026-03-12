import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#app";
import { useAuthStore } from "../stores/auth";

export default defineNuxtRouteMiddleware(() => {
  const store = useAuthStore();
  const config = useRuntimeConfig();
  const opts = config.public.nuxtAuthKit as any;
  const homePath = opts?.redirects?.home || "/";

  if (store.isAuthenticated) {
    return navigateTo(homePath);
  }
});

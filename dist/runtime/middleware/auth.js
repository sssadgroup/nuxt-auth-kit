import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#app";
import { useAuthStore } from "../stores/auth.js";
export default defineNuxtRouteMiddleware((to) => {
  const store = useAuthStore();
  const config = useRuntimeConfig();
  const opts = config.public.nuxtAuthKit;
  const loginPath = opts?.redirects?.login || "/auth/login";
  if (!store.isAuthenticated) {
    return navigateTo({
      path: loginPath,
      query: { redirect: to.fullPath }
    });
  }
});

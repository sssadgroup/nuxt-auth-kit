import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#app";
import { useAuthStore } from "../stores/auth.js";
export default defineNuxtRouteMiddleware((to, _from) => {
  const store = useAuthStore();
  const config = useRuntimeConfig();
  const opts = config.public.nuxtAuthKit;
  const loginPath = opts?.redirects?.login || "/auth/login";
  if (!store.isAuthenticated) {
    return navigateTo(loginPath);
  }
  const requiredRoles = to.meta?.roles;
  if (requiredRoles && requiredRoles.length > 0) {
    const superAdmin = opts?.rbac?.superAdminRole || "super-admin";
    if (!store.hasRole(superAdmin) && !store.hasRole(requiredRoles)) {
      return navigateTo("/");
    }
  }
});

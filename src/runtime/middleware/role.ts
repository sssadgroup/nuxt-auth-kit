// Usage in page: definePageMeta({ middleware: [['role', 'admin']] })
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from "#app";
import { useAuthStore } from "../stores/auth";

export default defineNuxtRouteMiddleware((to, _from) => {
  const store = useAuthStore();
  const config = useRuntimeConfig();
  const opts = config.public.nuxtAuthKit as any;
  const loginPath = opts?.redirects?.login || "/auth/login";

  if (!store.isAuthenticated) {
    return navigateTo(loginPath);
  }

  // Roles can be passed via route meta
  const requiredRoles = to.meta?.roles as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const superAdmin = opts?.rbac?.superAdminRole || "super-admin";
    if (!store.hasRole(superAdmin) && !store.hasRole(requiredRoles)) {
      return navigateTo("/");
    }
  }
});

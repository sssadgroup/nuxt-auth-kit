import { defineNuxtPlugin, useCookie, useRuntimeConfig } from "#app";
import { useAuthStore } from "../stores/auth";
import { useAuth } from "../composables/useAuth";

export default defineNuxtPlugin({
  name: "nuxt-auth-kit",
  // Run AFTER Pinia plugin so $pinia is available
  dependsOn: ["pinia"],
  async setup(nuxtApp) {
    const store = useAuthStore(nuxtApp.$pinia as any);
    const config = useRuntimeConfig();
    const opts = config.public.nuxtAuthKit as any;
    const tokenCookieName = opts?.tokenCookieName || "auth_token";
    const tokenCookie = useCookie<string | null>(tokenCookieName);

    // Restore token from cookie on app boot
    if (tokenCookie.value && !store.token) {
      store.setToken(tokenCookie.value);
      // Fetch user info to restore session
      try {
        const { fetchUser } = useAuth();
        await fetchUser();
      } catch (_) {
        store.clearAuth();
        tokenCookie.value = null;
      }
    }
  },
});

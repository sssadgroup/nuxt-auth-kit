import {
  defineNuxtModule,
  addPlugin,
  addImports,
  addComponent,
  createResolver,
} from "@nuxt/kit";
import { join } from "pathe";
import type { ModuleOptions } from "./runtime/types";

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-auth-kit",
    configKey: "nuxtAuthKit",
    compatibility: {
      nuxt: "^3.0.0 || ^4.0.0",
    },
  },

  defaults: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
    tokenStorage: "cookie",
    tokenCookieName: "auth_token",
    endpoints: {
      login: "/api/auth/login",
      register: "/api/auth/register",
      logout: "/api/auth/logout",
      me: "/api/auth/me",
      updateProfile: "/api/profile",
      updatePassword: "/api/profile/password",
      forgotPassword: "/api/auth/forgot-password",
      resetPassword: "/api/auth/reset-password",
    },
    redirects: {
      login: "/auth/login",
      home: "/",
      afterLogout: "/auth/login",
    },
    rbac: {
      superAdminRole: "super-admin",
      defaultUserRole: "user",
    },
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Make options available in runtime config
    nuxt.options.runtimeConfig.public.nuxtAuthKit = {
      apiBase: options.apiBase,
      endpoints: options.endpoints,
      redirects: options.redirects,
      tokenCookieName: options.tokenCookieName,
      rbac: options.rbac,
    };

    // Add Pinia if not already installed
    if (!nuxt.options.modules?.includes("@pinia/nuxt")) {
      nuxt.options.modules.push("@pinia/nuxt");
    }

    // Register plugin
    addPlugin(resolver.resolve("./runtime/plugins/auth"));

    // Register composables (auto-imported)
    addImports([
      {
        name: "useAuth",
        as: "useAuth",
        from: resolver.resolve("./runtime/composables/useAuth"),
      },
      {
        name: "useAuthStore",
        as: "useAuthStore",
        from: resolver.resolve("./runtime/stores/auth"),
      },
    ]);

    // ─── Middlewares ──────────────────────────────────────────────────────────
    // Nuxt 3 & 4 compatible: inject middleware files directly into the app's
    // middleware array via the 'app:resolve' hook. This makes them available
    // as named middlewares in definePageMeta({ middleware: 'auth' })
    nuxt.hook("app:resolve", (app) => {
      const middlewareDir = resolver.resolve("./runtime/middleware");
      for (const name of ["auth", "guest", "role"]) {
        const path = join(middlewareDir, name);
        const exists = app.middleware.find((m: any) => m.name === name);
        if (!exists) {
          app.middleware.push({ name, path, global: false });
        }
      }
    });

    // Register components (auto-imported)
    const components = [
      {
        name: "AuthLayout",
        filePath: resolver.resolve("./runtime/components/auth/AuthLayout.vue"),
      },
      {
        name: "AuthLoginForm",
        filePath: resolver.resolve("./runtime/components/auth/LoginForm.vue"),
      },
      {
        name: "AuthRegisterForm",
        filePath: resolver.resolve(
          "./runtime/components/auth/RegisterForm.vue",
        ),
      },
      {
        name: "AuthForgotPasswordForm",
        filePath: resolver.resolve(
          "./runtime/components/auth/ForgotPasswordForm.vue",
        ),
      },
      {
        name: "AuthResetPasswordForm",
        filePath: resolver.resolve(
          "./runtime/components/auth/ResetPasswordForm.vue",
        ),
      },
      {
        name: "ProfileUpdateForm",
        filePath: resolver.resolve(
          "./runtime/components/profile/UpdateProfileForm.vue",
        ),
      },
      {
        name: "ProfileUpdatePasswordForm",
        filePath: resolver.resolve(
          "./runtime/components/profile/UpdatePasswordForm.vue",
        ),
      },
    ];

    for (const component of components) {
      addComponent(component);
    }
  },
});

// Re-export types
export type {
  ModuleOptions,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "./runtime/types";

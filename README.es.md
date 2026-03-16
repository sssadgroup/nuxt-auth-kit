<div align="center">

# nuxt-auth-kit

**Módulo de autenticación llave en mano para APIs Laravel con Nuxt.**
Instálalo una vez — login, registro, perfil, contraseñas, roles y permisos listos para usar.

[![npm version](https://img.shields.io/npm/v/nuxt-auth-kit?color=18794e&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-auth-kit?color=1d5fc4&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![License: MIT](https://img.shields.io/badge/license-MIT-6d28d9?style=flat-square)](./LICENSE)
[![Nuxt 3 & 4](https://img.shields.io/badge/Nuxt-3%20%26%204-18794e?style=flat-square)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-b45309?style=flat-square)](https://www.typescriptlang.org)

**Leer en otro idioma:**
🇬🇧 [English](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.md) · 🇫🇷 [Français](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.fr.md) · 🇸🇦 [العربية](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.ar.md) · 🇨🇳 [中文](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.zh.md) · 🇩🇪 [Deutsch](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.de.md)

</div>

---

## Funcionalidades

- ✅ **Inicio / Cierre de sesión** con sesión persistida vía cookie segura
- ✅ **Registro** con confirmación de contraseña
- ✅ **Perfil conectado** (`useAuth().user`)
- ✅ **Actualización del perfil** (nombre, email, avatar)
- ✅ **Cambio de contraseña**
- ✅ **Contraseña olvidada** (envío de email)
- ✅ **Restablecimiento de contraseña** (vía token)
- ✅ **Roles y permisos** (RBAC) — `hasRole()`, `hasPermission()`
- ✅ **Middlewares nombrados**: `auth`, `guest`, `role`
- ✅ **7 componentes Vue de pantalla dividida** — auto-importados, Tailwind CSS
- ✅ Soporte **TypeScript** completo

## Instalación

```bash
npm install nuxt-auth-kit
# o
yarn add nuxt-auth-kit
# o
pnpm add nuxt-auth-kit
```

> Requiere `@nuxt/ui` para los estilos. Compatible con **Nuxt 3.x** y **Nuxt 4.x**.

## Configuración

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxt-auth-kit", "@nuxt/ui"],

  nuxtAuthKit: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",

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

    tokenCookieName: "auth_token",

    rbac: {
      superAdminRole: "super-admin",
      defaultUserRole: "user",
    },
  },
});
```

```env
# .env
NUXT_PUBLIC_API_BASE=https://api.miproyecto.com
```

## Uso

### Páginas de autenticación

```vue
<!-- pages/auth/login.vue -->
<template>
  <AuthLayout :quote="quote">
    <AuthLoginForm
      :roles="[
        { value: 'user', label: 'Como usuario' },
        { value: 'owner', label: 'Como propietario' },
      ]"
      :show-social="true"
      @forgot-password="navigateTo('/auth/forgot-password')"
      @register="navigateTo('/auth/register')"
    />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
const quote = {
  text: "Una experiencia fluida y agradable.",
  author: "3S Tech Group",
  location: "Dakar",
};
</script>
```

```vue
<!-- pages/auth/register.vue -->
<template>
  <AuthLayout>
    <AuthRegisterForm @login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
</script>
```

```vue
<!-- pages/auth/forgot-password.vue -->
<template>
  <AuthLayout>
    <AuthForgotPasswordForm @back-to-login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
</script>
```

```vue
<!-- pages/auth/reset-password.vue -->
<template>
  <AuthLayout>
    <!-- Lee automáticamente ?token= y ?email= desde la URL -->
    <AuthResetPasswordForm @back-to-login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
</script>
```

### Página de perfil

```vue
<!-- pages/profile/index.vue -->
<template>
  <div class="max-w-2xl mx-auto py-10 px-4 space-y-10">
    <ProfileUpdateForm
      title="Mi perfil"
      :show-avatar="true"
      @success="onSaved"
    />
    <hr />
    <ProfileUpdatePasswordForm title="Cambiar contraseña" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
function onSaved() {
  /* mostrar notificación */
}
</script>
```

### Composable `useAuth`

Todo está **auto-importado** — no se necesita `import` en tus archivos.

```ts
const {
  user, // Ref<AuthUser | null>
  isAuthenticated, // ComputedRef<boolean>
  isGuest, // ComputedRef<boolean>
  loading, // Ref<boolean>

  // Acciones
  login,
  register,
  logout,
  fetchUser,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,

  // RBAC
  hasRole, // (role: string | string[]) => boolean
  hasPermission, // (perm: string | string[]) => boolean
} = useAuth();
```

#### Ejemplos RBAC

```ts
const { hasRole, hasPermission } = useAuth();

if (hasRole("admin")) {
  /* ... */
}
if (hasRole(["admin", "manager"])) {
  /* ... */
}
if (hasPermission("edit-posts")) {
  /* ... */
}
```

```vue
<template>
  <AdminPanel v-if="hasRole('admin')" />
  <button v-if="hasPermission('create-post')">Crear artículo</button>
</template>
```

> El rol `super-admin` (configurable via `rbac.superAdminRole`) bypasea todas las verificaciones en el middleware `role`.

### Middlewares

```ts
// Solo usuarios autenticados
definePageMeta({ middleware: "auth" });

// Solo invitados — redirige a / si está conectado
definePageMeta({ middleware: "guest" });

// Acceso basado en rol
definePageMeta({ middleware: "role", roles: ["admin", "manager"] });

// Auth + rol combinados
definePageMeta({ middleware: ["auth", "role"], roles: ["admin"] });
```

## API Laravel esperada

Todos los endpoints son personalizables via `nuxtAuthKit.endpoints`.

| Método | Ruta                        | Auth | Respuesta         | Descripción               |
| ------ | --------------------------- | ---- | ----------------- | ------------------------- |
| `POST` | `/api/auth/login`           | —    | `{ user, token }` | Inicio de sesión          |
| `POST` | `/api/auth/register`        | —    | `{ user, token }` | Registro                  |
| `POST` | `/api/auth/logout`          | ✅   | `{ message }`     | Cierre de sesión          |
| `GET`  | `/api/auth/me`              | ✅   | `{ user }`        | Usuario actual            |
| `PUT`  | `/api/profile`              | ✅   | `{ user }`        | Actualizar perfil         |
| `PUT`  | `/api/profile/password`     | ✅   | `{ message }`     | Cambiar contraseña        |
| `POST` | `/api/auth/forgot-password` | —    | `{ message }`     | Email de restablecimiento |
| `POST` | `/api/auth/reset-password`  | —    | `{ message }`     | Restablecer con token     |

> El campo `user` debe contener como mínimo `id`, `name`, `email`. Los campos `roles` y `permissions` (arrays de strings) son opcionales para activar el RBAC.

### Ejemplo con Laravel Sanctum

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('login',           [AuthController::class, 'login']);
    Route::post('register',        [AuthController::class, 'register']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',  [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout',  [AuthController::class, 'logout']);
        Route::get('me',       [AuthController::class, 'me']);
        Route::put('profile',  [AuthController::class, 'updateProfile']);
        Route::put('password', [AuthController::class, 'updatePassword']);
    });
});
```

```php
// AuthController.php
public function me(Request $request): JsonResponse
{
    return response()->json([
        'user' => $request->user()->load('roles', 'permissions'),
    ]);
}
```

## Tipos TypeScript

```ts
import type {
  AuthUser, // estructura del usuario
  LoginCredentials, // { email, password, remember? }
  RegisterData, // { name, email, password, password_confirmation }
  UpdateProfileData, // { name?, email?, avatar? }
  UpdatePasswordData, // { current_password, new_password, new_password_confirmation }
  ForgotPasswordData, // { email }
  ResetPasswordData, // { token, email, password, password_confirmation }
  AuthResponse, // { user, token }
  ApiError, // { message, errors? }
  ModuleOptions, // configuración nuxtAuthKit
} from "nuxt-auth-kit";
```

## Arquitectura

```
nuxt-auth-kit/
├── build.config.ts
├── package.json
└── src/
    ├── module.ts
    └── runtime/
        ├── types/index.ts
        ├── stores/auth.ts
        ├── composables/useAuth.ts
        ├── plugins/auth.ts
        ├── middleware/
        │   ├── auth.ts
        │   ├── guest.ts
        │   └── role.ts
        └── components/
            ├── auth/
            │   ├── AuthLayout.vue
            │   ├── LoginForm.vue
            │   ├── RegisterForm.vue
            │   ├── ForgotPasswordForm.vue
            │   └── ResetPasswordForm.vue
            └── profile/
                ├── UpdateProfileForm.vue
                └── UpdatePasswordForm.vue
```

---

<div align="center">

Licencia MIT · Hecho con ❤️ por [3S Tech Group](https://github.com/sssadgroup)
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 Documentación](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

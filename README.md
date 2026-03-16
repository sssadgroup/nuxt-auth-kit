<div align="center">

# nuxt-auth-kit

**Plug-and-play Nuxt authentication module for Laravel APIs.**
Install once — login, registration, profile, passwords, roles & permissions are ready.

[![npm version](https://img.shields.io/npm/v/nuxt-auth-kit?color=18794e&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-auth-kit?color=1d5fc4&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![License: MIT](https://img.shields.io/badge/license-MIT-6d28d9?style=flat-square)](./LICENSE)
[![Nuxt 3 & 4](https://img.shields.io/badge/Nuxt-3%20%26%204-18794e?style=flat-square)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-b45309?style=flat-square)](https://www.typescriptlang.org)

**Read this in another language:**
🇫🇷 [Français](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.fr.md) · 🇸🇦 [العربية](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.ar.md) · 🇪🇸 [Español](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.es.md) · 🇨🇳 [中文](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.zh.md) · 🇩🇪 [Deutsch](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.de.md)

</div>

---

## Features

- ✅ **Login / Logout** with persistent session via secure cookie
- ✅ **Registration** with password confirmation
- ✅ **Connected profile** (`useAuth().user`)
- ✅ **Profile update** (name, email, avatar)
- ✅ **Password change**
- ✅ **Forgot password** (email sending)
- ✅ **Password reset** (via token)
- ✅ **Roles & permissions** (RBAC) — `hasRole()`, `hasPermission()`
- ✅ **Named middlewares**: `auth`, `guest`, `role`
- ✅ **7 split-screen Vue components** — auto-imported, Tailwind CSS
- ✅ **Full TypeScript** support

## Installation

```bash
npm install nuxt-auth-kit
# or
yarn add nuxt-auth-kit
# or
pnpm add nuxt-auth-kit
```

> Requires `@nuxt/ui` for styles. Compatible with **Nuxt 3.x** and **Nuxt 4.x**.

## Configuration

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
NUXT_PUBLIC_API_BASE=https://api.myproject.com
```

## Usage

### Authentication pages

```vue
<!-- pages/auth/login.vue -->
<template>
  <AuthLayout :quote="quote">
    <AuthLoginForm
      :roles="[
        { value: 'user', label: 'As a user' },
        { value: 'owner', label: 'As an owner' },
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
  text: "A smooth and enjoyable experience.",
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
    <!-- Automatically reads ?token= and ?email= from the URL -->
    <AuthResetPasswordForm @back-to-login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
</script>
```

### Profile page

```vue
<!-- pages/profile/index.vue -->
<template>
  <div class="max-w-2xl mx-auto py-10 px-4 space-y-10">
    <ProfileUpdateForm
      title="My profile"
      :show-avatar="true"
      @success="onSaved"
    />
    <hr />
    <ProfileUpdatePasswordForm title="Change password" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
function onSaved() {
  /* show toast */
}
</script>
```

### `useAuth` composable

Everything is **auto-imported** — no `import` needed in your files.

```ts
const {
  user, // Ref<AuthUser | null>
  isAuthenticated, // ComputedRef<boolean>
  isGuest, // ComputedRef<boolean>
  loading, // Ref<boolean>

  // Actions
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

#### RBAC examples

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
  <button v-if="hasPermission('create-post')">Create post</button>
</template>
```

> The `super-admin` role (configurable via `rbac.superAdminRole`) bypasses all checks in the `role` middleware.

### Middlewares

```ts
// Authenticated users only
definePageMeta({ middleware: "auth" });

// Guests only — redirects to / if logged in
definePageMeta({ middleware: "guest" });

// Role-based access
definePageMeta({ middleware: "role", roles: ["admin", "manager"] });

// Auth + role combined
definePageMeta({ middleware: ["auth", "role"], roles: ["admin"] });
```

## Expected Laravel API

All endpoints are customizable via `nuxtAuthKit.endpoints`.

| Method | Route                       | Auth | Response          | Description      |
| ------ | --------------------------- | ---- | ----------------- | ---------------- |
| `POST` | `/api/auth/login`           | —    | `{ user, token }` | Login            |
| `POST` | `/api/auth/register`        | —    | `{ user, token }` | Register         |
| `POST` | `/api/auth/logout`          | ✅   | `{ message }`     | Logout           |
| `GET`  | `/api/auth/me`              | ✅   | `{ user }`        | Current user     |
| `PUT`  | `/api/profile`              | ✅   | `{ user }`        | Update profile   |
| `PUT`  | `/api/profile/password`     | ✅   | `{ message }`     | Change password  |
| `POST` | `/api/auth/forgot-password` | —    | `{ message }`     | Send reset email |
| `POST` | `/api/auth/reset-password`  | —    | `{ message }`     | Reset with token |

> The `user` field must contain at minimum `id`, `name`, `email`. The `roles` and `permissions` fields (string arrays) are optional for RBAC.

### Laravel Sanctum example

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

## TypeScript Types

```ts
import type {
  AuthUser, // user structure
  LoginCredentials, // { email, password, remember? }
  RegisterData, // { name, email, password, password_confirmation }
  UpdateProfileData, // { name?, email?, avatar? }
  UpdatePasswordData, // { current_password, new_password, new_password_confirmation }
  ForgotPasswordData, // { email }
  ResetPasswordData, // { token, email, password, password_confirmation }
  AuthResponse, // { user, token }
  ApiError, // { message, errors? }
  ModuleOptions, // nuxtAuthKit config
} from "nuxt-auth-kit";
```

## Architecture

```
nuxt-auth-kit/
├── build.config.ts
├── package.json
└── src/
    ├── module.ts                        # Nuxt module entry point
    └── runtime/
        ├── types/index.ts               # TypeScript types
        ├── stores/auth.ts               # Pinia store
        ├── composables/useAuth.ts       # Main composable
        ├── plugins/auth.ts              # Session restore at boot
        ├── middleware/
        │   ├── auth.ts                  # Protected routes
        │   ├── guest.ts                 # Guest-only routes
        │   └── role.ts                  # Role-based access
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

MIT License · Made with ❤️ by [3S Tech Group](https://github.com/sssadgroup)
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 Documentation](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

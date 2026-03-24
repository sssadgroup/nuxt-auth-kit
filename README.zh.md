<div align="center">

# nuxt-auth-kit

**专为 Laravel API 设计的开箱即用 Nuxt 认证模块。**
安装一次 — 登录、注册、个人资料、密码、角色与权限均已就绪。

[![npm version](https://img.shields.io/npm/v/nuxt-auth-kit?color=18794e&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-auth-kit?color=1d5fc4&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![License: MIT](https://img.shields.io/badge/license-MIT-6d28d9?style=flat-square)](./LICENSE)
[![Nuxt 3 & 4](https://img.shields.io/badge/Nuxt-3%20%26%204-18794e?style=flat-square)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-b45309?style=flat-square)](https://www.typescriptlang.org)

**阅读其他语言版本：**
🇬🇧 [English](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.md) · 🇫🇷 [Français](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.fr.md) · 🇸🇦 [العربية](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.ar.md) · 🇪🇸 [Español](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.es.md) · 🇩🇪 [Deutsch](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.de.md)

</div>

---

## 功能特性

- ✅ **登录 / 退出登录**，通过安全 Cookie 持久化会话
- ✅ **注册**（含密码确认）
- ✅ **已登录用户信息** (`useAuth().user`)
- ✅ **个人资料更新**（姓名、邮箱、头像）
- ✅ **修改密码**
- ✅ **忘记密码**（发送邮件）
- ✅ **重置密码**（通过 token）
- ✅ **角色与权限管理** (RBAC) — `hasRole()`、`hasPermission()`
- ✅ **命名中间件**：`auth`、`guest`、`role`
- ✅ **7 个分屏 Vue 组件** — 自动导入，Tailwind CSS
- ✅ 完整 **TypeScript** 支持

## 安装

```bash
npm install nuxt-auth-kit
# 或
yarn add nuxt-auth-kit
# 或
pnpm add nuxt-auth-kit
```

> 需要 `@nuxt/ui` 提供样式。兼容 **Nuxt 3.x** 和 **Nuxt 4.x**。

## 配置

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

## 使用方法

### 认证页面

```vue
<!-- pages/auth/login.vue -->
<template>
  <AuthLayout :quote="quote">
    <AuthLoginForm
      :show-social="true"
      @forgot-password="navigateTo('/auth/forgot-password')"
      @register="navigateTo('/auth/register')"
      @google-login="handleGoogleLogin"
      @apple-login="handleAppleLogin"
    />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
const quote = {
  text: "流畅愉快的体验。",
  author: "3S Tech Group",
  location: "达喀尔",
};

async function handleGoogleLogin() {
  // 重定向到你的 Google OAuth 提供商（例如：Supabase、Laravel Socialite 等）
  // await navigateTo('/auth/google', { external: true })
  console.log("已触发 Google 登录");
}

async function handleAppleLogin() {
  // 重定向到你的 Apple OAuth 提供商
  // await navigateTo('/auth/apple', { external: true })
  console.log("已触发 Apple 登录");
}
</script>
```

```vue
<!-- pages/auth/register.vue -->
<template>
  <AuthLayout>
    <!-- 默认：密码必填，不显示手机号 -->
    <AuthRegisterForm />

    <!-- 不需要密码 -->
    <AuthRegisterForm :except="['password']" />

    <!-- 不显示手机号 -->
    <AuthRegisterForm :except="['phone']" @login="navigateTo('/auth/login')" />

    <!-- 不显示手机号且不需要密码 -->
    <AuthRegisterForm
      :except="['password', 'phone']"
      @login="navigateTo('/auth/login')"
    />
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
    <!-- 自动从 URL 中读取 ?token= 和 ?email= -->
    <AuthResetPasswordForm @back-to-login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
</script>
```

### 个人资料页面

```vue
<!-- pages/profile/index.vue -->
<template>
  <div class="max-w-2xl mx-auto py-10 px-4 space-y-10">
    <!-- 默认：名字、姓氏、邮箱可见 -->
    <ProfileUpdateForm
      title="我的资料"
      :show-avatar="true"
      @success="onProfileSaved"
    />

    <!-- 显示手机号，不显示邮箱 -->
    <ProfileUpdateForm :except="['email']" @success="onProfileSaved" />

    <!-- 仅显示姓名 -->
    <ProfileUpdateForm :except="['email', 'phone']" @success="onProfileSaved" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

function onProfileSaved() {
  // 例如：显示一个 toast 通知
}
</script>
```

### `useAuth` 组合式函数

所有内容均**自动导入** — 无需在文件中手动 `import`。

```ts
const {
  user, // Ref<AuthUser | null>
  isAuthenticated, // ComputedRef<boolean>
  isGuest, // ComputedRef<boolean>
  loading, // Ref<boolean>

  // 操作
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

#### RBAC 示例

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
  <button v-if="hasPermission('create-post')">创建文章</button>
</template>
```

> `super-admin` 角色（可通过 `rbac.superAdminRole` 配置）会绕过 `role` 中间件中的所有检查。

### 中间件

```ts
// 仅限已登录用户
definePageMeta({ middleware: "auth" });

// 仅限访客 — 已登录则重定向至 /
definePageMeta({ middleware: "guest" });

// 基于角色的访问
definePageMeta({ middleware: "role", roles: ["admin", "manager"] });

// 认证 + 角色组合
definePageMeta({ middleware: ["auth", "role"], roles: ["admin"] });
```

## 预期的 Laravel API

所有端点可通过 `nuxtAuthKit.endpoints` 自定义。

| 方法   | 路由                        | Auth | 响应              | 说明          |
| ------ | --------------------------- | ---- | ----------------- | ------------- |
| `POST` | `/api/auth/login`           | —    | `{ user, token }` | 登录          |
| `POST` | `/api/auth/register`        | —    | `{ user, token }` | 注册          |
| `POST` | `/api/auth/logout`          | ✅   | `{ message }`     | 退出登录      |
| `GET`  | `/api/auth/me`              | ✅   | `{ user }`        | 当前用户      |
| `PUT`  | `/api/profile`              | ✅   | `{ user }`        | 更新资料      |
| `PUT`  | `/api/profile/password`     | ✅   | `{ message }`     | 修改密码      |
| `POST` | `/api/auth/forgot-password` | —    | `{ message }`     | 发送重置邮件  |
| `POST` | `/api/auth/reset-password`  | —    | `{ message }`     | 用 token 重置 |

> `user` 字段必须至少包含 `id`、`name`、`email`。`roles` 和 `permissions` 字段（字符串数组）为启用 RBAC 的可选字段。

### Laravel Sanctum 示例

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

## TypeScript 类型

```ts
import type {
  AuthUser, // 用户结构
  LoginCredentials, // { email, password, remember? }
  RegisterData, // { name, email, password, password_confirmation }
  UpdateProfileData, // { name?, email?, avatar? }
  UpdatePasswordData, // { current_password, new_password, new_password_confirmation }
  ForgotPasswordData, // { email }
  ResetPasswordData, // { token, email, password, password_confirmation }
  AuthResponse, // { user, token }
  ApiError, // { message, errors? }
  ModuleOptions, // nuxtAuthKit 配置
} from "nuxt-auth-kit";
```

## 架构

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

MIT 许可证 · 由 [3S Tech Group](https://github.com/sssadgroup) 用 ❤️ 制作
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 文档](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

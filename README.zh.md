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
🇬🇧 [English](./README.md) · 🇫🇷 [Français](./README.fr.md) · 🇸🇦 [العربية](./README.ar.md) · 🇪🇸 [Español](./README.es.md) · 🇩🇪 [Deutsch](./README.de.md)

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
  modules: ['nuxt-auth-kit', '@nuxt/ui'],

  nuxtAuthKit: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',

    endpoints: {
      login:          '/api/auth/login',
      register:       '/api/auth/register',
      logout:         '/api/auth/logout',
      me:             '/api/auth/me',
      updateProfile:  '/api/profile',
      updatePassword: '/api/profile/password',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword:  '/api/auth/reset-password',
    },

    redirects: {
      login:       '/auth/login',
      home:        '/',
      afterLogout: '/auth/login',
    },

    tokenCookieName: 'auth_token',

    rbac: {
      superAdminRole:  'super-admin',
      defaultUserRole: 'user',
    },
  },
})
```

```env
# .env
NUXT_PUBLIC_API_BASE=https://api.myproject.com
```

## 使用方法

### `useAuth` 组合式函数

所有内容均**自动导入** — 无需在文件中手动 `import`。

```ts
const {
  user,            // Ref<AuthUser | null>
  isAuthenticated, // ComputedRef<boolean>
  isGuest,         // ComputedRef<boolean>
  loading,         // Ref<boolean>

  login, register, logout, fetchUser,
  updateProfile, updatePassword,
  forgotPassword, resetPassword,

  hasRole,         // (role: string | string[]) => boolean
  hasPermission,   // (perm: string | string[]) => boolean
} = useAuth()
```

### 中间件

```ts
// 仅限已登录用户
definePageMeta({ middleware: 'auth' })

// 仅限访客 — 已登录则重定向至 /
definePageMeta({ middleware: 'guest' })

// 基于角色的访问
definePageMeta({ middleware: 'role', roles: ['admin', 'manager'] })

// 认证 + 角色组合
definePageMeta({ middleware: ['auth', 'role'], roles: ['admin'] })
```

## 预期的 Laravel API

所有端点可通过 `nuxtAuthKit.endpoints` 自定义。

| 方法 | 路由 | Auth | 响应 | 说明 |
|------|------|------|------|------|
| `POST` | `/api/auth/login` | — | `{ user, token }` | 登录 |
| `POST` | `/api/auth/register` | — | `{ user, token }` | 注册 |
| `POST` | `/api/auth/logout` | ✅ | `{ message }` | 退出登录 |
| `GET` | `/api/auth/me` | ✅ | `{ user }` | 当前用户 |
| `PUT` | `/api/profile` | ✅ | `{ user }` | 更新资料 |
| `PUT` | `/api/profile/password` | ✅ | `{ message }` | 修改密码 |
| `POST` | `/api/auth/forgot-password` | — | `{ message }` | 发送重置邮件 |
| `POST` | `/api/auth/reset-password` | — | `{ message }` | 用 token 重置 |

---

<div align="center">

MIT 许可证 · 由 [3S Tech Group](https://github.com/sssadgroup) 用 ❤️ 制作
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 文档](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

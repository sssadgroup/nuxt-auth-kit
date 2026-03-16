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
🇬🇧 [English](./README.md) · 🇫🇷 [Français](./README.fr.md) · 🇸🇦 [العربية](./README.ar.md) · 🇨🇳 [中文](./README.zh.md) · 🇩🇪 [Deutsch](./README.de.md)

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
NUXT_PUBLIC_API_BASE=https://api.miproyecto.com
```

## Uso

### Composable `useAuth`

Todo está **auto-importado** — no se necesita `import` en tus archivos.

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

### Middlewares

```ts
// Solo usuarios autenticados
definePageMeta({ middleware: 'auth' })

// Solo invitados — redirige a / si está conectado
definePageMeta({ middleware: 'guest' })

// Acceso basado en rol
definePageMeta({ middleware: 'role', roles: ['admin', 'manager'] })

// Auth + rol combinados
definePageMeta({ middleware: ['auth', 'role'], roles: ['admin'] })
```

## API Laravel esperada

| Método | Ruta | Auth | Respuesta | Descripción |
|--------|------|------|-----------|-------------|
| `POST` | `/api/auth/login` | — | `{ user, token }` | Inicio de sesión |
| `POST` | `/api/auth/register` | — | `{ user, token }` | Registro |
| `POST` | `/api/auth/logout` | ✅ | `{ message }` | Cierre de sesión |
| `GET` | `/api/auth/me` | ✅ | `{ user }` | Usuario actual |
| `PUT` | `/api/profile` | ✅ | `{ user }` | Actualizar perfil |
| `PUT` | `/api/profile/password` | ✅ | `{ message }` | Cambiar contraseña |
| `POST` | `/api/auth/forgot-password` | — | `{ message }` | Email de restablecimiento |
| `POST` | `/api/auth/reset-password` | — | `{ message }` | Restablecer con token |

---

<div align="center">

Licencia MIT · Hecho con ❤️ por [3S Tech Group](https://github.com/sssadgroup)
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 Documentación](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

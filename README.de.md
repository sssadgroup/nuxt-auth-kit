<div align="center">

# nuxt-auth-kit

**Schlüsselfertiges Nuxt-Authentifizierungsmodul für Laravel-APIs.**
Einmal installiert — Login, Registrierung, Profil, Passwörter, Rollen und Berechtigungen sind einsatzbereit.

[![npm version](https://img.shields.io/npm/v/nuxt-auth-kit?color=18794e&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-auth-kit?color=1d5fc4&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![License: MIT](https://img.shields.io/badge/license-MIT-6d28d9?style=flat-square)](./LICENSE)
[![Nuxt 3 & 4](https://img.shields.io/badge/Nuxt-3%20%26%204-18794e?style=flat-square)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-b45309?style=flat-square)](https://www.typescriptlang.org)

**In einer anderen Sprache lesen:**
🇬🇧 [English](./README.md) · 🇫🇷 [Français](./README.fr.md) · 🇸🇦 [العربية](./README.ar.md) · 🇪🇸 [Español](./README.es.md) · 🇨🇳 [中文](./README.zh.md)

</div>

---

## Funktionen

- ✅ **Login / Logout** mit persistierter Sitzung via sicherem Cookie
- ✅ **Registrierung** mit Passwortbestätigung
- ✅ **Verbundenes Profil** (`useAuth().user`)
- ✅ **Profilaktualisierung** (Name, E-Mail, Avatar)
- ✅ **Passwort ändern**
- ✅ **Passwort vergessen** (E-Mail-Versand)
- ✅ **Passwort zurücksetzen** (via Token)
- ✅ **Rollen & Berechtigungen** (RBAC) — `hasRole()`, `hasPermission()`
- ✅ **Benannte Middlewares**: `auth`, `guest`, `role`
- ✅ **7 Vue Split-Screen-Komponenten** — automatisch importiert, Tailwind CSS
- ✅ Vollständige **TypeScript**-Unterstützung

## Installation

```bash
npm install nuxt-auth-kit
# oder
yarn add nuxt-auth-kit
# oder
pnpm add nuxt-auth-kit
```

> Erfordert `@nuxt/ui` für Styles. Kompatibel mit **Nuxt 3.x** und **Nuxt 4.x**.

## Konfiguration

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
NUXT_PUBLIC_API_BASE=https://api.meinprojekt.de
```

## Verwendung

### `useAuth` Composable

Alles wird **automatisch importiert** — kein `import` in Ihren Dateien nötig.

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
// Nur authentifizierte Nutzer
definePageMeta({ middleware: 'auth' })

// Nur Gäste — leitet zu / weiter wenn eingeloggt
definePageMeta({ middleware: 'guest' })

// Rollenbasierter Zugriff
definePageMeta({ middleware: 'role', roles: ['admin', 'manager'] })

// Auth + Rolle kombiniert
definePageMeta({ middleware: ['auth', 'role'], roles: ['admin'] })
```

## Erwartete Laravel-API

Alle Endpunkte sind über `nuxtAuthKit.endpoints` anpassbar.

| Methode | Route | Auth | Antwort | Beschreibung |
|---------|-------|------|---------|--------------|
| `POST` | `/api/auth/login` | — | `{ user, token }` | Login |
| `POST` | `/api/auth/register` | — | `{ user, token }` | Registrierung |
| `POST` | `/api/auth/logout` | ✅ | `{ message }` | Logout |
| `GET` | `/api/auth/me` | ✅ | `{ user }` | Aktueller Nutzer |
| `PUT` | `/api/profile` | ✅ | `{ user }` | Profil aktualisieren |
| `PUT` | `/api/profile/password` | ✅ | `{ message }` | Passwort ändern |
| `POST` | `/api/auth/forgot-password` | — | `{ message }` | Reset-E-Mail senden |
| `POST` | `/api/auth/reset-password` | — | `{ message }` | Reset mit Token |

### Laravel Sanctum Beispiel

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

---

<div align="center">

MIT-Lizenz · Erstellt mit ❤️ von [3S Tech Group](https://github.com/sssadgroup)
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 Dokumentation](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

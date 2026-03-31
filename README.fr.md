<div align="center">

# nuxt-auth-kit

**Module Nuxt d'authentification clé-en-main pour API Laravel.**
Installez-le une fois — connexion, inscription, profil, mots de passe, rôles et permissions sont prêts à l'emploi.

[![npm version](https://img.shields.io/npm/v/nuxt-auth-kit?color=18794e&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-auth-kit?color=1d5fc4&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![License: MIT](https://img.shields.io/badge/license-MIT-6d28d9?style=flat-square)](./LICENSE)
[![Nuxt 3 & 4](https://img.shields.io/badge/Nuxt-3%20%26%204-18794e?style=flat-square)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-b45309?style=flat-square)](https://www.typescriptlang.org)

**Lire dans une autre langue :**
🇬🇧 [English](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.md) · 🇸🇦 [العربية](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.ar.md) · 🇪🇸 [Español](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.es.md) · 🇨🇳 [中文](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.zh.md) · 🇩🇪 [Deutsch](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.de.md)

</div>

---

## Fonctionnalités

- ✅ **Connexion / Déconnexion** avec session persistée via cookie sécurisé
- ✅ **Inscription** avec confirmation de mot de passe
- ✅ **Profil connecté** (`useAuth().user`)
- ✅ **Modification du profil** (nom, email, avatar)
- ✅ **Changement de mot de passe**
- ✅ **Mot de passe oublié** (envoi d'email)
- ✅ **Réinitialisation de mot de passe** (via token)
- ✅ **Rôles & permissions** (RBAC) — `hasRole()`, `hasPermission()`
- ✅ **Middlewares nommés** : `auth`, `guest`, `role`
- ✅ **7 composants Vue split-screen** — auto-importés, Tailwind CSS
- ✅ **TypeScript** complet
- ✅ **Thème paramétrable** (prop `ui` sur chaque composant) — couleurs, rounded, boutons, layout
- ✅ **Saisie numéro de téléphone** — composant `PhoneInput` avec sélecteur de pays, drapeaux, formatage automatique (E.164)
- ✅ **Prop `except`** sur `RegisterForm` & `UpdateProfileForm` — masquer/exclure des champs dynamiquement

## Installation

```bash
npm install nuxt-auth-kit
# ou
yarn add nuxt-auth-kit
# ou
pnpm add nuxt-auth-kit
```

> Requiert `@nuxt/ui` pour les styles. Compatible **Nuxt 3.x** et **Nuxt 4.x**.

> Installez aussi `libphonenumber-js` pour le composant PhoneInput : `npm install libphonenumber-js`

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
NUXT_PUBLIC_API_BASE=https://api.monprojet.com
```

## Utilisation

### Pages d'authentification

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
  text: "Une expérience fluide et agréable.",
  author: "3S Tech Group",
  location: "Dakar",
};

async function handleGoogleLogin() {
  // Redirige vers ton fournisseur OAuth Google (ex : Supabase, Laravel Socialite, etc.)
  // await navigateTo('/auth/google', { external: true })
  console.log("Connexion Google déclenchée");
}

async function handleAppleLogin() {
  // Redirige vers ton fournisseur OAuth Apple
  // await navigateTo('/auth/apple', { external: true })
  console.log("Connexion Apple déclenchée");
}
</script>
```

```vue
<!-- pages/auth/register.vue -->
<template>
  <AuthLayout>
    <!-- Défaut — mot de passe requis, sans téléphone -->
    <AuthRegisterForm />

    <!-- Sans mot de passe -->
    <AuthRegisterForm :except="['password']" />

    <!-- Sans téléphone -->
    <AuthRegisterForm :except="['phone']" @login="navigateTo('/auth/login')" />

    <!-- Sans téléphone ni mot de passe -->
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
    <!-- Lit automatiquement ?token= et ?email= depuis l'URL -->
    <AuthResetPasswordForm @back-to-login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
</script>
```

### Page profil

```vue
<!-- pages/profile/index.vue -->
<template>
  <div class="max-w-2xl mx-auto py-10 px-4 space-y-10">
    <!-- Défaut — prénom, nom, email visibles -->
    <ProfileUpdateForm
      title="Mon profil"
      :show-avatar="true"
      @success="onProfileSaved"
    />

    <!-- Avec téléphone, sans email -->
    <ProfileUpdateForm :except="['email']" @success="onProfileSaved" />

    <!-- Nom uniquement -->
    <ProfileUpdateForm :except="['email', 'phone']" @success="onProfileSaved" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

function onProfileSaved() {
  // ex: afficher une notification toast
}
</script>
```

### Composable `useAuth`

Tout est **auto-importé** — aucun `import` nécessaire dans vos fichiers.

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

#### Exemples RBAC

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
  <button v-if="hasPermission('create-post')">Créer un article</button>
</template>
```

> Le rôle `super-admin` (configurable via `rbac.superAdminRole`) bypasse toutes les vérifications dans le middleware `role`.

### Middlewares

```ts
// Page connectés uniquement
definePageMeta({ middleware: "auth" });

// Page visiteurs uniquement — redirige vers / si connecté
definePageMeta({ middleware: "guest" });

// Page avec rôle requis
definePageMeta({ middleware: "role", roles: ["admin", "manager"] });

// Auth + rôle combinés
definePageMeta({ middleware: ["auth", "role"], roles: ["admin"] });
```

## API Laravel attendue

Tous les endpoints sont personnalisables via `nuxtAuthKit.endpoints`.

| Méthode | Route                       | Auth | Réponse           | Description             |
| ------- | --------------------------- | ---- | ----------------- | ----------------------- |
| `POST`  | `/api/auth/login`           | —    | `{ user, token }` | Connexion               |
| `POST`  | `/api/auth/register`        | —    | `{ user, token }` | Inscription             |
| `POST`  | `/api/auth/logout`          | ✅   | `{ message }`     | Déconnexion             |
| `GET`   | `/api/auth/me`              | ✅   | `{ user }`        | Utilisateur connecté    |
| `PUT`   | `/api/profile`              | ✅   | `{ user }`        | Mise à jour profil      |
| `PUT`   | `/api/profile/password`     | ✅   | `{ message }`     | Changement mot de passe |
| `POST`  | `/api/auth/forgot-password` | —    | `{ message }`     | Email reset             |
| `POST`  | `/api/auth/reset-password`  | —    | `{ message }`     | Reset avec token        |

> Le champ `user` doit contenir au minimum `id`, `name`, `email`. Les champs `roles` et `permissions` (tableaux de strings) sont optionnels pour activer le RBAC.

### Exemple avec Laravel Sanctum

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

## Types TypeScript

```ts
import type {
  AuthUser, // structure de l'utilisateur
  LoginCredentials, // { email, password, remember? }
  RegisterData, // { name, email, password }
  UpdateProfileData, // { name?, email?, avatar? }
  UpdatePasswordData, // { current_password, new_password, new_password_confirmation }
  ForgotPasswordData, // { email }
  ResetPasswordData, // { token, email, password }
  AuthResponse, // { user, token }
  ApiError, // { message, errors? }
  ModuleOptions, // config nuxtAuthKit
} from "nuxt-auth-kit";
```

## Thème & styles

Chaque composant accepte une prop `ui` pour surcharger partiellement les styles.

```vue
<AuthLoginForm
  :ui="{
    inputRounded: 'rounded-lg',
    btnColor: 'primary',
    titleColor: 'text-slate-900',
    accentColor: 'text-blue-600',
  }"
/>

<AuthLayout
  :ui="{
    layoutPageColor: '#1e293b',
    layoutTextColor: '#f8fafc',
    layoutTaglineColor: 'rgba(248,250,252,0.7)',
  }"
/>
```

### `FormTheme` tokens

| Token                 | Défaut                   | Description                  |
| --------------------- | ------------------------ | ---------------------------- |
| `inputRounded`        | `rounded-full`           | Rayon de bordure des champs  |
| `color`               | `neutral`                | Couleur des inputs (Nuxt UI) |
| `btnRounded`          | `rounded-full`           | Rayon du bouton principal    |
| `btnColor`            | `neutral`                | Couleur du bouton principal  |
| `btnVariant`          | `solid`                  | Variante du bouton           |
| `btnSecondaryColor`   | `secondary`              | Couleur bouton secondaire    |
| `btnSecondaryVariant` | `subtle`                 | Variante bouton secondaire   |
| `btnSecondaryRounded` | `rounded-full`           | Rayon bouton secondaire      |
| `titleColor`          | `text-[#1a2e1a]`         | Couleur du titre             |
| `subtitleColor`       | `text-[#6b7c6b]`         | Couleur du sous-titre        |
| `accentColor`         | `text-[#1B4332]`         | Couleur d’accent             |
| `roleRingColor`       | `ring-[#1B4332]`         | Bordure active des rôles     |
| `layoutPageColor`     | `#eeeee6`                | Fond panneau gauche          |
| `layoutTextColor`     | `#ffffff`                | Couleur du texte             |
| `layoutTaglineColor`  | `rgba(255,255,255,0.75)` | Couleur slogan               |

## PhoneInput

```vue
<PhoneInput
  v-model="form.phone"
  v-model:country-code="form.phoneCountry"
  :preferred-countries="['SN', 'FR', 'CI', 'MA']"
  @data="onPhoneData"
/>
```

**`@data` event payload:**

```ts
{
  e164:        '+221771234567',  // Format E.164 → à stocker en base de données
  countryCode: 'SN',             // Code pays (ISO)
  formatted:   '77 123 45 67',   // Format national lisible
  isValid:     true,             // Indique si le numéro est valide
}
```

## Architecture

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
            ├── profile/
            │   ├── UpdateProfileForm.vue
            │   └── UpdatePasswordForm.vue
            └── ui/
                └── PhoneInput.vue          # 🆕 v1.2.0
        # composables/useFormTheme.ts        🆕 v1.2.0
```

---

<div align="center">

Licence MIT · Fait avec ❤️ par [3S Tech Group](https://github.com/sssadgroup)
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 Documentation](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

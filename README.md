# nuxt-auth-kit

Package Nuxt d'authentification clé-en-main pour API Laravel. Installez-le une fois, utilisez-le dans tous vos projets.

## Fonctionnalités

- ✅ **Connexion / Déconnexion**
- ✅ **Inscription** avec confirmation de mot de passe
- ✅ **Profil connecté** (`useAuth().user`)
- ✅ **Modification du profil** (nom, email, avatar)
- ✅ **Changement de mot de passe**
- ✅ **Mot de passe oublié** (envoi d'email)
- ✅ **Réinitialisation de mot de passe** (via token)
- ✅ **Gestion des rôles & permissions** (RBAC)
- ✅ **Middlewares** : `auth`, `guest`, `role`
- ✅ **Session persistante** via cookie sécurisé
- ✅ **Composants Vue** prêts à l'emploi (design Hotelook-like)
- ✅ **TypeScript** complet

## Installation

```bash
npm install nuxt-auth-kit
# ou
yarn add nuxt-auth-kit
# ou
pnpm add nuxt-auth-kit
```

## Configuration

Dans `nuxt.config.ts` :

```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-auth-kit',
    '@nuxt/ui'         // requis pour les styles
  ],

  nuxtAuthKit: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',

    // Endpoints Laravel (personnalisables)
    endpoints: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      me: '/api/auth/me',
      updateProfile: '/api/auth/profile',
      updatePassword: '/api/auth/password',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password'
    },

    // Redirections
    redirects: {
      login: '/auth/login',
      home: '/',
      afterLogout: '/auth/login'
    },

    // Cookie
    tokenCookieName: 'auth_token',

    // RBAC
    rbac: {
      superAdminRole: 'super-admin',
      defaultUserRole: 'user'
    }
  }
})
```

Dans `.env` :
```env
NUXT_PUBLIC_API_BASE=https://api.monprojet.com
```

---

## Utilisation

### Pages d'authentification

#### `pages/auth/login.vue`
```vue
<template>
  <AuthLayout app-name="MonApp" :quote="quote">
    <AuthLoginForm
      :roles="[
        { value: 'user', label: 'En tant qu\'utilisateur' },
        { value: 'owner', label: 'En tant que propriétaire' }
      ]"
      :show-social="true"
      @forgot-password="navigateTo('/auth/forgot-password')"
      @register="navigateTo('/auth/register')"
    />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const quote = {
  text: 'Une expérience fluide et agréable. La plateforme rend tout si simple.',
  author: 'Alex Mitchell',
  location: 'Amsterdam'
}
</script>
```

#### `pages/auth/register.vue`
```vue
<template>
  <AuthLayout app-name="MonApp">
    <AuthRegisterForm @login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })
</script>
```

#### `pages/auth/forgot-password.vue`
```vue
<template>
  <AuthLayout app-name="MonApp">
    <AuthForgotPasswordForm @back-to-login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })
</script>
```

#### `pages/auth/reset-password.vue`
```vue
<template>
  <AuthLayout app-name="MonApp">
    <AuthResetPasswordForm @back-to-login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })
</script>
```

---

### Page profil

#### `pages/profile/index.vue`
```vue
<template>
  <div class="max-w-2xl mx-auto py-10 px-4 space-y-10">
    <ProfileUpdateForm title="Mon profil" :show-avatar="true" />
    <hr class="border-gray-200" />
    <ProfileUpdatePasswordForm title="Changer le mot de passe" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>
```

---

### Le composable `useAuth`

```ts
const {
  user,              // Ref<AuthUser | null>
  isAuthenticated,   // ComputedRef<boolean>
  isGuest,           // ComputedRef<boolean>
  loading,           // Ref<boolean>

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
  hasRole,           // (role: string | string[]) => boolean
  hasPermission      // (perm: string | string[]) => boolean
} = useAuth()
```

#### Exemples RBAC
```ts
const { hasRole, hasPermission, user } = useAuth()

// Vérifier un rôle
if (hasRole('admin')) { ... }
if (hasRole(['admin', 'manager'])) { ... }

// Vérifier une permission
if (hasPermission('edit-posts')) { ... }

// Dans un template
<div v-if="hasRole('admin')">Section admin</div>
```

---

### Middlewares

```ts
// Page protégée (utilisateurs connectés uniquement)
definePageMeta({ middleware: 'auth' })

// Page publique (invités uniquement, redirige si connecté)
definePageMeta({ middleware: 'guest' })

// Page avec rôle requis
definePageMeta({
  middleware: 'role',
  roles: ['admin', 'manager']  // au moins un des rôles
})
```

---

## API Laravel attendue

Le package attend les endpoints suivants (personnalisables) :

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/login` | Connexion → `{ user, token }` |
| `POST` | `/api/auth/register` | Inscription → `{ user, token }` |
| `POST` | `/api/auth/logout` | Déconnexion |
| `GET` | `/api/auth/me` | Utilisateur connecté → `{ user }` |
| `PUT` | `/api/auth/profile` | Mise à jour profil → `{ user }` |
| `PUT` | `/api/auth/password` | Changement mot de passe |
| `POST` | `/api/auth/forgot-password` | Email de réinitialisation |
| `POST` | `/api/auth/reset-password` | Réinitialisation avec token |

### Exemple avec Laravel Sanctum

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('password', [AuthController::class, 'updatePassword']);
    });
});
```

---

## Architecture du package

```
nuxt-auth-kit/
├── src/
│   ├── module/
│   │   └── index.ts              # Nuxt module definition
│   └── runtime/
│       ├── types/
│       │   └── index.ts          # TypeScript types
│       ├── stores/
│       │   └── auth.ts           # Pinia store
│       ├── composables/
│       │   └── useAuth.ts        # Main composable
│       ├── plugins/
│       │   └── auth.ts           # Session restore plugin
│       ├── middleware/
│       │   ├── auth.ts           # Protected routes
│       │   ├── guest.ts          # Guest-only routes
│       │   └── role.ts           # Role-based access
│       └── components/
│           ├── auth/
│           │   ├── AuthLayout.vue         # Split-screen layout
│           │   ├── LoginForm.vue          # Login form
│           │   ├── RegisterForm.vue       # Register form
│           │   ├── ForgotPasswordForm.vue # Forgot password
│           │   └── ResetPasswordForm.vue  # Reset password
│           └── profile/
│               ├── UpdateProfileForm.vue  # Profile update
│               └── UpdatePasswordForm.vue # Password update
├── package.json
└── README.md
```

---

## Mise en ligne (publication npm)

Voir le fichier `PUBLISH.md` pour la procédure complète.

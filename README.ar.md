<div align="center">

# nuxt-auth-kit

**وحدة Nuxt جاهزة للمصادقة مع واجهات Laravel.**
ثبّتها مرة واحدة — تسجيل الدخول، التسجيل، الملف الشخصي، كلمات المرور، الأدوار والصلاحيات جاهزة للاستخدام.

[![npm version](https://img.shields.io/npm/v/nuxt-auth-kit?color=18794e&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-auth-kit?color=1d5fc4&style=flat-square)](https://www.npmjs.com/package/nuxt-auth-kit)
[![License: MIT](https://img.shields.io/badge/license-MIT-6d28d9?style=flat-square)](./LICENSE)
[![Nuxt 3 & 4](https://img.shields.io/badge/Nuxt-3%20%26%204-18794e?style=flat-square)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-b45309?style=flat-square)](https://www.typescriptlang.org)

**اقرأ بلغة أخرى:**
🇬🇧 [English](./README.md) · 🇫🇷 [Français](./README.fr.md) · 🇪🇸 [Español](./README.es.md) · 🇨🇳 [中文](./README.zh.md) · 🇩🇪 [Deutsch](./README.de.md)

</div>

---

<div dir="rtl">

## المميزات

- ✅ **تسجيل الدخول / الخروج** مع جلسة محفوظة عبر كوكي آمنة
- ✅ **التسجيل** مع تأكيد كلمة المرور
- ✅ **الملف الشخصي للمتصل** (`useAuth().user`)
- ✅ **تحديث الملف الشخصي** (الاسم، البريد الإلكتروني، الصورة)
- ✅ **تغيير كلمة المرور**
- ✅ **نسيت كلمة المرور** (إرسال بريد إلكتروني)
- ✅ **إعادة تعيين كلمة المرور** (عبر token)
- ✅ **الأدوار والصلاحيات** (RBAC) — `hasRole()`، `hasPermission()`
- ✅ **وسيطات مسماة**: `auth`، `guest`، `role`
- ✅ **7 مكونات Vue بشاشة مقسمة** — مستوردة تلقائياً، Tailwind CSS
- ✅ دعم **TypeScript** كامل

## التثبيت

</div>

```bash
npm install nuxt-auth-kit
# أو
yarn add nuxt-auth-kit
# أو
pnpm add nuxt-auth-kit
```

<div dir="rtl">

> يتطلب `@nuxt/ui` للأنماط. متوافق مع **Nuxt 3.x** و **Nuxt 4.x**.

## الإعداد

</div>

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

<div dir="rtl">

## الاستخدام

### الـ composable الرئيسي `useAuth`

كل شيء **مستورد تلقائياً** — لا حاجة لـ `import` في ملفاتك.

</div>

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

<div dir="rtl">

### الوسيطات

</div>

```ts
definePageMeta({ middleware: 'auth' })   // للمستخدمين المسجلين فقط
definePageMeta({ middleware: 'guest' })  // للزوار فقط
definePageMeta({ middleware: 'role', roles: ['admin', 'manager'] })
```

<div dir="rtl">

## واجهة Laravel المطلوبة

جميع نقاط النهاية قابلة للتخصيص عبر `nuxtAuthKit.endpoints`.

| الطريقة | المسار | Auth | الاستجابة | الوصف |
|---------|--------|------|-----------|-------|
| `POST` | `/api/auth/login` | — | `{ user, token }` | تسجيل الدخول |
| `POST` | `/api/auth/register` | — | `{ user, token }` | التسجيل |
| `POST` | `/api/auth/logout` | ✅ | `{ message }` | تسجيل الخروج |
| `GET` | `/api/auth/me` | ✅ | `{ user }` | المستخدم الحالي |
| `PUT` | `/api/profile` | ✅ | `{ user }` | تحديث الملف الشخصي |
| `PUT` | `/api/profile/password` | ✅ | `{ message }` | تغيير كلمة المرور |
| `POST` | `/api/auth/forgot-password` | — | `{ message }` | إرسال بريد الإعادة |
| `POST` | `/api/auth/reset-password` | — | `{ message }` | إعادة التعيين بـ token |

> يجب أن يحتوي حقل `user` على الحد الأدنى: `id` و`name` و`email`. حقلا `roles` و`permissions` (مصفوفات نصية) اختياريان لتفعيل RBAC.

</div>

---

<div align="center">

رخصة MIT · صُنع بـ ❤️ بواسطة [3S Tech Group](https://github.com/sssadgroup)
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 التوثيق](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

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
🇬🇧 [English](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.md) · 🇫🇷 [Français](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.fr.md) · 🇪🇸 [Español](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.es.md) · 🇨🇳 [中文](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.zh.md) · 🇩🇪 [Deutsch](https://github.com/sssadgroup/nuxt-auth-kit/blob/main/README.de.md)

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
- ✅ **سمة قابلة للتخصيص** (prop `ui` على كل مكوّن) — الألوان، الحواف، الأزرار، التخطيط
- ✅ **إدخال رقم الهاتف** — مكوّن `PhoneInput` مع اختيار الدولة والأعلام والتنسيق التلقائي (E.164)
- ✅ **prop `except`** على `RegisterForm` و`UpdateProfileForm` — إخفاء/إقصاء الحقول ديناميكياً

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

> ثبّت أيضاً `libphonenumber-js` لمكوّن PhoneInput: `npm install libphonenumber-js`

## الإعداد

</div>

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

<div dir="rtl">

## الاستخدام

### صفحات المصادقة

</div>

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
  text: "تجربة سلسة وممتعة.",
  author: "3S Tech Group",
  location: "داكار",
};

async function handleGoogleLogin() {
  // إعادة التوجيه إلى مزود OAuth الخاص بـ Google (مثل: Supabase أو Laravel Socialite وغيرها)
  // await navigateTo('/auth/google', { external: true })
  console.log("تم تشغيل تسجيل الدخول عبر Google");
}

async function handleAppleLogin() {
  // إعادة التوجيه إلى مزود OAuth الخاص بـ Apple
  // await navigateTo('/auth/apple', { external: true })
  console.log("تم تشغيل تسجيل الدخول عبر Apple");
}
</script>
```

```vue
<!-- pages/auth/register.vue -->
<template>
  <AuthLayout>
    <!-- الوضع الافتراضي — كلمة المرور مطلوبة، بدون رقم هاتف -->
    <AuthRegisterForm />

    <!-- بدون كلمة مرور -->
    <AuthRegisterForm :except="['password']" />

    <!-- بدون رقم هاتف -->
    <AuthRegisterForm :except="['phone']" @login="navigateTo('/auth/login')" />

    <!-- بدون رقم هاتف وبدون كلمة مرور -->
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
    <!-- يقرأ تلقائياً ?token= و ?email= من الرابط -->
    <AuthResetPasswordForm @back-to-login="navigateTo('/auth/login')" />
  </AuthLayout>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "guest" });
</script>
```

<div dir="rtl">

### صفحة الملف الشخصي

</div>

```vue
<!-- pages/profile/index.vue -->
<template>
  <div class="max-w-2xl mx-auto py-10 px-4 space-y-10">
    <!-- الوضع الافتراضي — الاسم الأول واسم العائلة والبريد الإلكتروني ظاهرة -->
    <ProfileUpdateForm
      title="ملفي الشخصي"
      :show-avatar="true"
      @success="onProfileSaved"
    />

    <!-- مع الهاتف، بدون البريد الإلكتروني -->
    <ProfileUpdateForm :except="['email']" @success="onProfileSaved" />

    <!-- الاسم فقط -->
    <ProfileUpdateForm :except="['email', 'phone']" @success="onProfileSaved" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

function onProfileSaved() {
  // مثال: عرض إشعار toast
}
</script>
```

<div dir="rtl">

### الـ composable الرئيسي `useAuth`

كل شيء **مستورد تلقائياً** — لا حاجة لـ `import` في ملفاتك.

</div>

```ts
const {
  user, // Ref<AuthUser | null>
  isAuthenticated, // ComputedRef<boolean>
  isGuest, // ComputedRef<boolean>
  loading, // Ref<boolean>

  // الإجراءات
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

<div dir="rtl">

#### أمثلة RBAC

</div>

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
  <button v-if="hasPermission('create-post')">إنشاء مقال</button>
</template>
```

<div dir="rtl">

> دور `super-admin` (قابل للضبط عبر `rbac.superAdminRole`) يتجاوز جميع الفحوصات في الوسيط `role`.

### الوسيطات

</div>

```ts
// للمستخدمين المسجلين فقط
definePageMeta({ middleware: "auth" });

// للزوار فقط — يعيد التوجيه إلى / إذا كنت مسجلاً
definePageMeta({ middleware: "guest" });

// وصول مبني على الدور
definePageMeta({ middleware: "role", roles: ["admin", "manager"] });

// مصادقة + دور مجتمعان
definePageMeta({ middleware: ["auth", "role"], roles: ["admin"] });
```

<div dir="rtl">

## واجهة Laravel المطلوبة

جميع نقاط النهاية قابلة للتخصيص عبر `nuxtAuthKit.endpoints`.

| الطريقة | المسار                      | Auth | الاستجابة         | الوصف                    |
| ------- | --------------------------- | ---- | ----------------- | ------------------------ |
| `POST`  | `/api/auth/login`           | —    | `{ user, token }` | تسجيل الدخول             |
| `POST`  | `/api/auth/register`        | —    | `{ user, token }` | التسجيل                  |
| `POST`  | `/api/auth/logout`          | ✅   | `{ message }`     | تسجيل الخروج             |
| `GET`   | `/api/auth/me`              | ✅   | `{ user }`        | المستخدم الحالي          |
| `PUT`   | `/api/profile`              | ✅   | `{ user }`        | تحديث الملف الشخصي       |
| `PUT`   | `/api/profile/password`     | ✅   | `{ message }`     | تغيير كلمة المرور        |
| `POST`  | `/api/auth/forgot-password` | —    | `{ message }`     | إرسال بريد إعادة التعيين |
| `POST`  | `/api/auth/reset-password`  | —    | `{ message }`     | إعادة التعيين بـ token   |

> يجب أن يحتوي حقل `user` على الحد الأدنى: `id` و`name` و`email`. حقلا `roles` و`permissions` (مصفوفات نصية) اختياريان لتفعيل RBAC.

### مثال مع Laravel Sanctum

</div>

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

<div dir="rtl">

## أنواع TypeScript

</div>

```ts
import type {
  AuthUser, // بنية المستخدم
  LoginCredentials, // { email, password, remember? }
  RegisterData, // { name, email, password, password_confirmation }
  UpdateProfileData, // { name?, email?, avatar? }
  UpdatePasswordData, // { current_password, new_password, new_password_confirmation }
  ForgotPasswordData, // { email }
  ResetPasswordData, // { token, email, password, password_confirmation }
  AuthResponse, // { user, token }
  ApiError, // { message, errors? }
  ModuleOptions, // إعداد nuxtAuthKit
} from "nuxt-auth-kit";
```

<div dir="rtl">

## السمة والأنماط

كل مكوّن يقبل prop `ui` لتجاوز الأنماط جزئياً.

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

| الخاصية               | القيمة الافتراضية        | الوصف             |
| --------------------- | ------------------------ | ----------------- |
| `inputRounded`        | `rounded-full`           | حواف الحقول       |
| `color`               | `neutral`                | لون الحقول        |
| `btnRounded`          | `rounded-full`           | حواف الزر         |
| `btnColor`            | `neutral`                | لون الزر          |
| `btnVariant`          | `solid`                  | نوع الزر          |
| `btnSecondaryColor`   | `secondary`              | لون الزر الثانوي  |
| `btnSecondaryVariant` | `subtle`                 | نوع الزر الثانوي  |
| `btnSecondaryRounded` | `rounded-full`           | حواف الزر الثانوي |
| `titleColor`          | `text-[#1a2e1a]`         | لون العنوان       |
| `subtitleColor`       | `text-[#6b7c6b]`         | لون الوصف         |
| `accentColor`         | `text-[#1B4332]`         | لون التمييز       |
| `roleRingColor`       | `ring-[#1B4332]`         | لون الإطار النشط  |
| `layoutPageColor`     | `#eeeee6`                | خلفية الصفحة      |
| `layoutTextColor`     | `#ffffff`                | لون النص          |
| `layoutTaglineColor`  | `rgba(255,255,255,0.75)` | لون الشعار        |

## PhoneInput

```vue
<PhoneInput
  v-model="form.phone"
  v-model:country-code="form.phoneCountry"
  :preferred-countries="['SN', 'FR', 'CI', 'MA']"
  @data="onPhoneData"
/>
```

**بيانات الحدث `@data`**

```ts
{
  e164:        '+221771234567',  // تنسيق E.164 → يُخزن في قاعدة البيانات
  countryCode: 'SN',             // رمز الدولة
  formatted:   '77 123 45 67',   // التنسيق المحلي
  isValid:     true,             // هل الرقم صالح
}
```

## البنية

</div>

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

رخصة MIT · صُنع بـ ❤️ بواسطة [3S Tech Group](https://github.com/sssadgroup)
[📦 npm](https://www.npmjs.com/package/nuxt-auth-kit) · [💻 GitHub](https://github.com/sssadgroup/nuxt-auth-kit) · [📖 التوثيق](https://sssadgroup.github.io/nuxt-auth-kit)

</div>

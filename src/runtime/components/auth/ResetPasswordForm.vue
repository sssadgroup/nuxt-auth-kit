<template>
  <div class="auth-reset-password">
    <div v-if="!done">
      <h1 class="text-3xl font-bold text-[#1a2e1a] mb-2">{{ title }}</h1>
      <p class="text-[#6b7c6b] mb-8">{{ subtitle }}</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">Email <span class="text-red-500">*</span></label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input v-model="form.email" type="email" required placeholder="hello@example.com"
              class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-4 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition" />
          </div>
          <p v-if="fieldErrors.email" class="text-red-500 text-xs mt-1">{{ fieldErrors.email }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">Nouveau mot de passe <span class="text-red-500">*</span></label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required placeholder="Minimum 8 caractères"
              class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-12 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="fieldErrors.password" class="text-red-500 text-xs mt-1">{{ fieldErrors.password }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">Confirmer le mot de passe <span class="text-red-500">*</span></label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <input v-model="form.password_confirmation" :type="showPassword ? 'text' : 'password'" required placeholder="Confirmez votre mot de passe"
              class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-4 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition" />
          </div>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-[#1B4332] hover:bg-[#163828] text-[#D4FF6B] font-semibold py-3.5 rounded-2xl transition-colors disabled:opacity-60 mt-2">
          <span v-if="!loading">Réinitialiser le mot de passe</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Réinitialisation...
          </span>
        </button>
      </form>
    </div>

    <div v-else class="text-center">
      <div class="w-16 h-16 bg-[#1B4332]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-[#1a2e1a] mb-3">Mot de passe réinitialisé !</h2>
      <p class="text-[#6b7c6b] mb-8">Votre mot de passe a été mis à jour avec succès.</p>
      <button type="button" @click="$emit('back-to-login')"
        class="bg-[#1B4332] hover:bg-[#163828] text-[#D4FF6B] font-semibold py-3 px-8 rounded-2xl transition-colors">
        Se connecter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useRoute } from '#app'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
}>(), {
  title: 'Nouveau mot de passe',
  subtitle: 'Choisissez un nouveau mot de passe sécurisé.'
})

const emit = defineEmits<{ 'back-to-login': [] }>()

const route = useRoute()
const { resetPassword, loading } = useAuth()

const form = reactive({
  email: (route.query.email as string) || '',
  password: '',
  password_confirmation: '',
  token: (route.query.token as string) || (route.params.token as string) || ''
})
const showPassword = ref(false)
const error = ref<string | null>(null)
const fieldErrors = reactive<Record<string, string>>({})
const done = ref(false)

async function handleSubmit() {
  error.value = null
  Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])

  const result = await resetPassword(form)

  if (result.success) {
    done.value = true
  } else if (result.error) {
    if (result.error.errors) {
      Object.entries(result.error.errors).forEach(([k, v]) => { fieldErrors[k] = v[0] })
    } else {
      error.value = result.error.message
    }
  }
}
</script>

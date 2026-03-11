<template>
  <div class="auth-forgot-password">
    <div v-if="!sent">
      <h1 class="text-3xl font-bold text-[#1a2e1a] mb-2">{{ title }}</h1>
      <p class="text-[#6b7c6b] mb-8">{{ subtitle }}</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">
            Email <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="hello@example.com"
              required
              autocomplete="email"
              class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-4 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-[#1B4332] hover:bg-[#163828] text-[#D4FF6B] font-semibold py-3.5 rounded-2xl transition-colors disabled:opacity-60 mt-2"
        >
          <span v-if="!loading">Envoyer le lien de réinitialisation</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Envoi en cours...
          </span>
        </button>
      </form>
    </div>

    <!-- Success state -->
    <div v-else class="text-center">
      <div class="w-16 h-16 bg-[#1B4332]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-[#1B4332]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-[#1a2e1a] mb-3">Email envoyé !</h2>
      <p class="text-[#6b7c6b] mb-8">
        Si un compte existe pour <strong>{{ email }}</strong>, vous recevrez un lien de réinitialisation sous peu.
      </p>
      <button
        type="button"
        @click="sent = false; email = ''"
        class="text-[#1B4332] font-semibold hover:underline text-sm"
      >
        Utiliser un autre email
      </button>
    </div>

    <p class="text-center text-sm text-[#6b7c6b] mt-6">
      <button type="button" @click="$emit('back-to-login')" class="text-[#1B4332] font-semibold hover:underline flex items-center gap-1 mx-auto">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour à la connexion
      </button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
}>(), {
  title: 'Mot de passe oublié ?',
  subtitle: 'Saisissez votre email pour recevoir un lien de réinitialisation.'
})

defineEmits<{ 'back-to-login': [] }>()

const { forgotPassword, loading } = useAuth()

const email = ref('')
const error = ref<string | null>(null)
const sent = ref(false)

async function handleSubmit() {
  error.value = null
  const result = await forgotPassword({ email: email.value })
  if (result.success) {
    sent.value = true
  } else {
    error.value = result.error?.message || 'Une erreur est survenue'
  }
}
</script>

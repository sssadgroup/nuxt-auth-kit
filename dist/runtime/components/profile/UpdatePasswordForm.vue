<template>
  <div class="profile-update-password">
    <h2 class="text-2xl font-bold text-[#1a2e1a] mb-6">{{ title }}</h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div v-if="successMsg" class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
        {{ successMsg }}
      </div>
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">Mot de passe actuel <span class="text-red-500">*</span></label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input v-model="form.current_password" :type="show.current ? 'text' : 'password'" required placeholder="Votre mot de passe actuel"
            class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-12 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition" />
          <button type="button" @click="show.current = !show.current" class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!show.current" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <p v-if="fieldErrors.current_password" class="text-red-500 text-xs mt-1">{{ fieldErrors.current_password }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">Nouveau mot de passe <span class="text-red-500">*</span></label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <input v-model="form.password" :type="show.new ? 'text' : 'password'" required placeholder="Minimum 8 caractères"
            class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-12 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition" />
          <button type="button" @click="show.new = !show.new" class="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!show.new" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <p v-if="fieldErrors.password" class="text-red-500 text-xs mt-1">{{ fieldErrors.password }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">Confirmer le nouveau mot de passe <span class="text-red-500">*</span></label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <input v-model="form.password_confirmation" :type="show.new ? 'text' : 'password'" required placeholder="Confirmez votre nouveau mot de passe"
            class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-4 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition" />
        </div>
      </div>

      <button type="submit" :disabled="loading"
        class="bg-[#1B4332] hover:bg-[#163828] text-[#D4FF6B] font-semibold py-3 px-8 rounded-2xl transition-colors disabled:opacity-60">
        <span v-if="!loading">Changer le mot de passe</span>
        <span v-else class="flex items-center gap-2">
          <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Modification...
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '../../composables/useAuth'

withDefaults(defineProps<{ title?: string }>(), { title: 'Changer le mot de passe' })

const { updatePassword, loading } = useAuth()

const form = reactive({ current_password: '', password: '', password_confirmation: '' })
const show = reactive({ current: false, new: false })
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const fieldErrors = reactive<Record<string, string>>({})

async function handleSubmit() {
  error.value = null
  successMsg.value = null
  Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])

  const result = await updatePassword(form)

  if (result.success) {
    successMsg.value = 'Mot de passe modifié avec succès !'
    form.current_password = ''
    form.password = ''
    form.password_confirmation = ''
  } else if (result.error) {
    if (result.error.errors) {
      Object.entries(result.error.errors).forEach(([k, v]) => { fieldErrors[k] = v[0] })
    } else {
      error.value = result.error.message
    }
  }
}
</script>

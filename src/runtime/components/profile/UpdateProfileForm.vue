<template>
  <div class="profile-update">
    <h2 class="text-2xl font-bold text-[#1a2e1a] mb-6">{{ title }}</h2>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div v-if="successMsg" class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
        {{ successMsg }}
      </div>
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
        {{ error }}
      </div>

      <!-- Avatar -->
      <div v-if="showAvatar" class="flex items-center gap-5">
        <div class="relative">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-[#1B4332]/10 flex items-center justify-center">
            <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover" alt="avatar" />
            <span v-else class="text-2xl font-bold text-[#1B4332]">{{ initials }}</span>
          </div>
          <label class="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1B4332] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#163828] transition">
            <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
          </label>
        </div>
        <div>
          <p class="font-medium text-[#1a2e1a]">{{ form.name || user?.name }}</p>
          <p class="text-sm text-[#6b7c6b]">{{ user?.email }}</p>
        </div>
      </div>

      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">Nom complet</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <input
            v-model="form.name"
            type="text"
            :placeholder="user?.name || 'Votre nom'"
            class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-4 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition"
          />
        </div>
        <p v-if="fieldErrors.name" class="text-red-500 text-xs mt-1">{{ fieldErrors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-[#1a2e1a] mb-1.5">Email</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a9a8a]">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            v-model="form.email"
            type="email"
            :placeholder="user?.email || 'votre@email.com'"
            class="w-full bg-white border border-[#e0e0d8] rounded-2xl py-3 pl-11 pr-4 text-[#1a2e1a] placeholder-[#aab4aa] focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 transition"
          />
        </div>
        <p v-if="fieldErrors.email" class="text-red-500 text-xs mt-1">{{ fieldErrors.email }}</p>
      </div>

      <!-- Extra slots for additional fields -->
      <slot name="extra-fields" :form="form" />

      <button
        type="submit"
        :disabled="loading"
        class="bg-[#1B4332] hover:bg-[#163828] text-[#D4FF6B] font-semibold py-3 px-8 rounded-2xl transition-colors disabled:opacity-60"
      >
        <span v-if="!loading">Enregistrer les modifications</span>
        <span v-else class="flex items-center gap-2">
          <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Enregistrement...
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'

withDefaults(defineProps<{
  title?: string
  showAvatar?: boolean
}>(), {
  title: 'Informations du profil',
  showAvatar: true
})

const emit = defineEmits<{ success: [user: any] }>()

const { user, updateProfile, loading } = useAuth()

const form = reactive({
  name: user?.name || '',
  email: user?.email || '',
  avatar: null as File | null
})

const avatarPreview = ref<string | null>(user?.avatar as string || null)
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const fieldErrors = reactive<Record<string, string>>({})

const initials = computed(() => {
  const name = form.name || user?.name || ''
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  form.avatar = file
  const reader = new FileReader()
  reader.onload = (ev) => { avatarPreview.value = ev.target?.result as string }
  reader.readAsDataURL(file)
}

async function handleSubmit() {
  error.value = null
  successMsg.value = null
  Object.keys(fieldErrors).forEach(k => delete fieldErrors[k])

  const data: any = {}
  if (form.name) data.name = form.name
  if (form.email) data.email = form.email
  if (form.avatar) data.avatar = form.avatar

  const result = await updateProfile(data)

  if (result.success) {
    successMsg.value = 'Profil mis à jour avec succès !'
    emit('success', user)
  } else if (result.error) {
    if (result.error.errors) {
      Object.entries(result.error.errors).forEach(([k, v]) => { fieldErrors[k] = v[0] })
    } else {
      error.value = result.error.message
    }
  }
}
</script>

<template>
  <div class="auth-layout min-h-screen flex">
    <!-- Left Panel: Form -->
    <div class="auth-layout__form w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 bg-[#EEEEE6]">
      <!-- Logo -->
      <div class="mb-10">
        <slot name="logo">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span class="text-xl font-bold text-[#1B4332]">{{ appName }}</span>
          </div>
        </slot>
      </div>

      <!-- Form Content -->
      <div class="max-w-md w-full mx-auto">
        <slot />
      </div>
    </div>

    <!-- Right Panel: Testimonial / Illustration -->
    <div class="hidden lg:flex lg:w-1/2 bg-[#F5F5ED] flex-col justify-between p-16 relative overflow-hidden">
      <div class="relative z-10">
        <!-- Quote -->
        <div class="text-[#D97706] text-5xl font-serif leading-none mb-6">"</div>
        <blockquote class="text-3xl font-medium text-[#1a2e1a] leading-relaxed mb-4">
          {{ quote.text }}
        </blockquote>
        <div class="text-[#D97706] text-5xl font-serif leading-none text-right mb-8">"</div>

        <!-- Author -->
        <div class="flex items-center gap-3">
          <div v-if="quote.avatar" class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            <img :src="quote.avatar" :alt="quote.author" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-12 h-12 rounded-full bg-[#1B4332] flex items-center justify-center">
            <span class="text-white text-lg font-semibold">{{ quote.author.charAt(0) }}</span>
          </div>
          <div>
            <p class="font-semibold text-[#1a2e1a]">{{ quote.author }}</p>
            <p class="text-sm text-[#6b7c6b]">{{ quote.location }}</p>
          </div>
        </div>
      </div>

      <!-- Illustration / Decoration -->
      <div class="absolute bottom-0 right-0 left-0 pointer-events-none">
        <slot name="illustration">
          <svg viewBox="0 0 600 400" class="w-full opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- City buildings illustration -->
            <rect x="320" y="120" width="80" height="280" rx="4" stroke="#2d4a3e" stroke-width="2" fill="#F5EFD6" />
            <rect x="340" y="140" width="12" height="18" rx="1" fill="#a8c4b0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="360" y="140" width="12" height="18" rx="1" fill="#a8c4b0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="340" y="175" width="12" height="18" rx="1" fill="#a8c4b0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="360" y="175" width="12" height="18" rx="1" fill="#a8c4b0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="340" y="210" width="12" height="18" rx="1" fill="#a8c4b0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="360" y="210" width="12" height="18" rx="1" fill="#a8c4b0" stroke="#2d4a3e" stroke-width="1.5" />

            <rect x="410" y="60" width="100" height="340" rx="4" stroke="#2d4a3e" stroke-width="2" fill="#F0E8C8" />
            <rect x="420" y="80" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="445" y="80" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="470" y="80" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="420" y="115" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="445" y="115" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="470" y="115" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="420" y="150" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="445" y="150" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="470" y="150" width="15" height="20" rx="1" fill="#b0cfc0" stroke="#2d4a3e" stroke-width="1.5" />

            <rect x="520" y="180" width="70" height="220" rx="4" stroke="#2d4a3e" stroke-width="2" fill="#d4e8d8" />
            <rect x="530" y="200" width="12" height="16" rx="1" fill="#88b898" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="550" y="200" width="12" height="16" rx="1" fill="#88b898" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="530" y="230" width="12" height="16" rx="1" fill="#88b898" stroke="#2d4a3e" stroke-width="1.5" />
            <rect x="550" y="230" width="12" height="16" rx="1" fill="#88b898" stroke="#2d4a3e" stroke-width="1.5" />

            <!-- Trees -->
            <circle cx="350" cy="370" r="20" stroke="#2d4a3e" stroke-width="2" fill="#a8d4b0" />
            <rect x="347" y="370" width="6" height="30" fill="#2d4a3e" />
            <circle cx="480" cy="365" r="16" stroke="#2d4a3e" stroke-width="2" fill="#88c498" />
            <rect x="477" y="365" width="5" height="25" fill="#2d4a3e" />

            <!-- Person -->
            <circle cx="300" cy="340" r="18" stroke="#2d4a3e" stroke-width="2" fill="#d4c8a8" />
            <path d="M280 400 Q300 355 320 400" stroke="#2d4a3e" stroke-width="2" fill="#a8c4b0" />
          </svg>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  appName?: string
  quote?: {
    text: string
    author: string
    location: string
    avatar?: string
  }
}>(), {
  appName: 'App',
  quote: () => ({
    text: 'Une expérience fluide et agréable. La plateforme rend tout si simple.',
    author: 'Alex Mitchell',
    location: 'Paris, France'
  })
})
</script>

<style scoped>
.auth-layout{font-family:inherit}
</style>

<template>
  <div class="min-h-screen bg-[#f5f5ed] flex items-center justify-center px-4">
    <div
      class="w-full max-w-md bg-white rounded-3xl shadow-sm border border-[#e0e0d8] p-8"
    >
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#1a2e1a] mb-2">{{ title }}</h1>
        <p class="text-[#6b7c6b]">{{ subtitle }}</p>
      </div>

      <!-- Forgot password success message -->
      <UAlert
        v-if="resetSent"
        icon="i-heroicons-check-circle"
        color="green"
        variant="soft"
        title="Email envoyé"
        description="Vérifiez votre boîte mail pour réinitialiser votre mot de passe."
        class="mb-6 rounded-2xl"
      />

      <!-- Error alert -->
      <UAlert
        v-if="error"
        icon="i-heroicons-exclamation-circle"
        color="red"
        variant="soft"
        :title="error"
        class="mb-6 rounded-2xl"
      />

      <!-- LOGIN FORM -->
      <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <UFormGroup label="Email" required :error="fieldErrors.email">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="hello@example.com"
            autocomplete="email"
            icon="i-heroicons-envelope"
            size="lg"
            :ui="{
              rounded: 'rounded-2xl',
              color: {
                white: {
                  outline:
                    'border-[#e0e0d8] focus:border-[#1B4332] focus:ring-[#1B4332]/20',
                },
              },
            }"
          />
        </UFormGroup>

        <!-- Password -->
        <UFormGroup label="Mot de passe" required :error="fieldErrors.password">
          <template #label>
            <div class="flex justify-between items-center w-full">
              <span class="text-sm font-medium text-[#1a2e1a]">
                Mot de passe <span class="text-red-500">*</span>
              </span>
              <UButton
                type="button"
                variant="link"
                color="green"
                size="xs"
                :padded="false"
                label="Mot de passe oublié ?"
                @click="mode = 'forgot'"
                class="text-[#1B4332] font-medium"
              />
            </div>
          </template>
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Entrez votre mot de passe"
            autocomplete="current-password"
            icon="i-heroicons-lock-closed"
            size="lg"
            :ui="{
              rounded: 'rounded-2xl',
              color: {
                white: {
                  outline:
                    'border-[#e0e0d8] focus:border-[#1B4332] focus:ring-[#1B4332]/20',
                },
              },
            }"
          >
            <template #trailing>
              <UButton
                type="button"
                variant="link"
                color="gray"
                :padded="false"
                :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormGroup>

        <!-- Submit -->
        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
          label="Se connecter"
          :ui="{
            base: 'w-full justify-center font-semibold',
            rounded: 'rounded-2xl',
            color: { green: { solid: 'bg-[#1B4332] hover:bg-[#163828] text-[#D4FF6B]' } },
            padding: { lg: 'py-3.5' },
          }"
          color="green"
          variant="solid"
          class="mt-2 bg-[#1B4332] hover:bg-[#163828] text-[#D4FF6B]"
        />
      </form>

      <!-- FORGOT PASSWORD FORM -->
      <form
        v-else-if="mode === 'forgot'"
        @submit.prevent="handleForgot"
        class="space-y-5"
      >
        <div class="mb-2">
          <p class="text-sm text-[#6b7c6b]">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser
            votre mot de passe.
          </p>
        </div>

        <UFormGroup label="Email" required :error="fieldErrors.email">
          <UInput
            v-model="resetEmail"
            type="email"
            placeholder="hello@example.com"
            autocomplete="email"
            icon="i-heroicons-envelope"
            size="lg"
            :ui="{
              rounded: 'rounded-2xl',
              color: {
                white: {
                  outline:
                    'border-[#e0e0d8] focus:border-[#1B4332] focus:ring-[#1B4332]/20',
                },
              },
            }"
          />
        </UFormGroup>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
          label="Envoyer le lien"
          color="green"
          variant="solid"
          class="mt-2 w-full bg-[#1B4332] hover:bg-[#163828] text-[#D4FF6B] font-semibold rounded-2xl py-3.5"
        />

        <div class="text-center">
          <UButton
            type="button"
            variant="link"
            color="gray"
            size="sm"
            icon="i-heroicons-arrow-left"
            label="Retour à la connexion"
            @click="
              mode = 'login';
              error = null;
            "
            class="text-[#6b7c6b] hover:text-[#1a2e1a]"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: "Connexion",
    subtitle: "Bienvenue ! Entrez vos informations pour continuer.",
  }
);

const emit = defineEmits<{
  success: [user: any];
  "forgot-password": [email: string];
}>();

// State
const mode = ref<"login" | "forgot">("login");
const loading = ref(false);
const showPassword = ref(false);
const error = ref<string | null>(null);
const resetSent = ref(false);
const fieldErrors = reactive<Record<string, string>>({});

const form = reactive({ email: "", password: "" });
const resetEmail = ref("");

async function handleLogin() {
  error.value = null;
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k]);
  loading.value = true;

  try {
    // const result = await login({ email: form.email, password: form.password })
    // if (!result.success) { ... } else { emit('success', result.user) }
    await new Promise((r) => setTimeout(r, 1000)); // simulate
    emit("success", null);
  } catch (e: any) {
    error.value = e?.message || "Une erreur est survenue.";
  } finally {
    loading.value = false;
  }
}

async function handleForgot() {
  error.value = null;
  loading.value = true;

  try {
    // await sendResetEmail(resetEmail.value)
    await new Promise((r) => setTimeout(r, 1000)); // simulate
    emit("forgot-password", resetEmail.value);
    resetSent.value = true;
    mode.value = "login";
  } catch (e: any) {
    error.value = e?.message || "Une erreur est survenue.";
  } finally {
    loading.value = false;
  }
}
</script>

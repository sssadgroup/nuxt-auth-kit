<template>
  <div class="auth-login">
    <h1 class="text-3xl font-bold text-[#1a2e1a] mb-2">{{ title }}</h1>
    <p class="text-[#6b7c6b] mb-8">{{ subtitle }}</p>

    <UForm
      :schema="schema"
      :state="form"
      @submit="handleSubmit"
      class="space-y-4"
    >
      <UFormField label="Email" name="email" required class="mt-6">
        <UInput
          v-model="form.email"
          class="w-full"
          size="xl"
          placeholder="oscar@sierra.com"
          icon="i-hugeicons-mail-account-02"
          color="neutral"
          :ui="{ base: 'rounded-full py-3 text-base' }"
        />
      </UFormField>

      <UFormField label="Mot de passe" name="password" required class="mt-6">
        <template #hint>
          <div
            @click="$emit('forgot-password')"
            class="text-sm text-[#1B4332] font-semibold hover:underline cursor-pointer"
          >
            Mot de passe oublié ?
          </div>
        </template>
        <template #default>
          <UInput
            v-model="form.password"
            size="xl"
            :type="showPassword ? 'text' : 'password'"
            placeholder="mot de passe"
            icon="i-hugeicons-square-lock-02"
            color="neutral"
            class="w-full"
            :ui="{ base: 'rounded-full py-3 text-base' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </template>
      </UFormField>

      <UButton
        type="submit"
        :loading="loading"
        :disabled="loading"
        color="neutral"
        size="lg"
        trailing-icon="i-lucide-log-in"
        class="w-full font-semibold py-3.5 rounded-full mt-2 justify-center"
      >
        {{ loading ? "Connexion en cours..." : "Se connecter" }}
      </UButton>
    </UForm>

    <!-- Social login -->
    <template v-if="showSocial">
      <div class="mt-16">
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-[#e5ebe5]" />
          <span class="text-sm text-[#6b7c6b]">ou continuer avec</span>
          <div class="flex-1 h-px bg-[#e5ebe5]" />
        </div>

        <div class="flex gap-3">
          <UButton
            variant="outline"
            color="neutral"
            size="lg"
            class="flex-1 font-semibold py-3.5 rounded-full mt-2 justify-center"
            @click="$emit('google-login')"
          >
            <template #leading>
              <UIcon name="i-logos-google-icon" class="w-5 h-5" />
            </template>
            Google
          </UButton>

          <UButton
            variant="outline"
            color="neutral"
            size="lg"
            class="flex-1 font-semibold py-3.5 rounded-full mt-2 justify-center"
            @click="$emit('apple-login')"
          >
            <template #leading>
              <UIcon name="i-logos-apple" class="w-5 h-5" />
            </template>
            Apple
          </UButton>
        </div>
      </div>
    </template>

    <p v-if="showRegisterBtn" class="text-center text-sm text-[#6b7c6b] mt-6">
      Pas encore de compte ?
      <span
        @click="$emit('register')"
        class="text-sm text-[#1B4332] font-semibold hover:underline cursor-pointer"
      >
        S'inscrire
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { z } from "zod";
import { useAuth } from "../../composables/useAuth";
import { useToast } from "#imports";

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    showSocial?: boolean;
    showRegisterBtn?: boolean;
  }>(),
  {
    title: "Connexion",
    subtitle: "Bienvenue ! Entrez vos informations pour continuer.",
    showSocial: false,
    showRegisterBtn: false,
  },
);

const emit = defineEmits<{
  "forgot-password": [];
  register: [];
  "google-login": [];
  "apple-login": [];
  success: [user: any];
}>();

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe est requis"),
});

const { login, loading } = useAuth();
const toast = useToast();

const form = reactive({ email: "", password: "" });
const showPassword = ref(false);

async function handleSubmit() {
  const result = await login({ email: form.email, password: form.password });

  if (!result.success && result.error) {
    toast.add({
      title: "Erreur de connexion",
      description: result.error.message ?? "Une erreur est survenue.",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  } else if (result.success) {
    toast.add({
      title: "Connexion réussie",
      description: "Bienvenue !",
      icon: "i-heroicons-check-circle",
      color: "success",
    });
    emit("success", null);
  }
}
</script>

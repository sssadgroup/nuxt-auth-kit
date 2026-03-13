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
          placeholder="hello@example.com"
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
  }>(),
  {
    title: "Connexion",
    subtitle: "Bienvenue ! Entrez vos informations pour continuer.",
  },
);

const emit = defineEmits<{
  "forgot-password": [];
  register: [];
  success: [user: any];
}>();

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
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

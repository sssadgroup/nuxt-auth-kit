<template>
  <div class="auth-register">
    <h1 class="text-3xl font-bold text-[#1a2e1a] mb-2">{{ title }}</h1>
    <p class="text-[#6b7c6b] mb-8">{{ subtitle }}</p>

    <UForm
      :schema="schema"
      :state="form"
      @submit="handleSubmit"
      class="space-y-4"
    >
      <UFormField label="Nom complet" name="name" required class="mt-6">
        <UInput
          v-model="form.name"
          class="w-full"
          size="xl"
          placeholder="Jean Dupont"
          icon="i-lucide-user"
          color="neutral"
          :ui="{ base: 'rounded-full py-3 text-base' }"
        />
      </UFormField>

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
        <UInput
          v-model="form.password"
          size="xl"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Minimum 8 caractères"
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
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField
        label="Confirmer le mot de passe"
        name="password_confirmation"
        required
        class="mt-6"
      >
        <UInput
          v-model="form.password_confirmation"
          size="xl"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Confirmez votre mot de passe"
          icon="i-hugeicons-square-lock-02"
          color="neutral"
          class="w-full"
          :ui="{ base: 'rounded-full py-3 text-base' }"
        />
      </UFormField>

      <UButton
        type="submit"
        :loading="loading"
        :disabled="loading"
        color="neutral"
        size="lg"
        trailing-icon="i-lucide-user-plus"
        class="w-full font-semibold py-3.5 rounded-full mt-2 justify-center"
      >
        {{ loading ? "Création en cours..." : "Créer un compte" }}
      </UButton>
    </UForm>

    <div class="text-center mt-6">
      <div class="mb-2 text-sm">Déjà un compte ?</div>
      <UButton
        type="button"
        @click="$emit('login')"
        color="secondary"
        variant="subtle"
        size="md"
        leading-icon="i-lucide-arrow-left"
        class="font-semibold py-3.5 rounded-full w-full justify-center"
      >
        Se connecter
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { z } from "zod";
import { useAuth } from "../../composables/useAuth";
import { useToast } from "#imports";

withDefaults(defineProps<{ title?: string; subtitle?: string }>(), {
  title: "Créer un compte",
  subtitle: "Rejoignez-nous dès aujourd'hui.",
});

const emit = defineEmits<{
  login: [];
  success: [user: any];
}>();

const schema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Minimum 8 caractères"),
    password_confirmation: z
      .string()
      .min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

const { register, loading } = useAuth();
const toast = useToast();

const form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});
const showPassword = ref(false);

async function handleSubmit() {
  const result = await register(form);

  if (!result.success && result.error) {
    toast.add({
      title: "Erreur d'inscription",
      description: result.error.message ?? "Une erreur est survenue.",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  } else if (result.success) {
    toast.add({
      title: "Compte créé !",
      description: "Bienvenue parmi nous.",
      icon: "i-heroicons-check-circle",
      color: "success",
    });
    emit("success", null);
  }
}
</script>

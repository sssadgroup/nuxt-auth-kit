<template>
  <div class="auth-reset-password">
    <div v-if="!done">
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

        <UFormField
          label="Nouveau mot de passe"
          name="password"
          required
          class="mt-6"
        >
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
          trailing-icon="i-lucide-key-round"
          class="w-full font-semibold py-3.5 rounded-full mt-2 justify-center"
        >
          {{
            loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"
          }}
        </UButton>
      </UForm>
    </div>

    <div v-else class="text-center">
      <div
        class="w-16 h-16 bg-[#1B4332]/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <UIcon name="i-heroicons-check-circle" class="w-8 h-8 text-[#1B4332]" />
      </div>
      <h2 class="text-2xl font-bold text-[#1a2e1a] mb-3">
        Mot de passe réinitialisé !
      </h2>
      <p class="text-[#6b7c6b] mb-8">
        Votre mot de passe a été mis à jour avec succès.
      </p>
      <UButton
        color="secondary"
        variant="subtle"
        size="md"
        trailing-icon="i-lucide-log-in"
        class="font-semibold py-3.5 rounded-full w-full justify-center"
        @click="$emit('back-to-login')"
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
import { useRoute } from "#app";
import { useToast } from "#imports";

withDefaults(defineProps<{ title?: string; subtitle?: string }>(), {
  title: "Nouveau mot de passe",
  subtitle: "Choisissez un nouveau mot de passe sécurisé.",
});

defineEmits<{ "back-to-login": [] }>();

const schema = z
  .object({
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

const route = useRoute();
const { resetPassword, loading } = useAuth();
const toast = useToast();

const form = reactive({
  email: (route.query.email as string) || "",
  password: "",
  password_confirmation: "",
  token: (route.query.token as string) || (route.params.token as string) || "",
});
const showPassword = ref(false);
const done = ref(false);

async function handleSubmit() {
  const result = await resetPassword(form);

  if (result.success) {
    done.value = true;
  } else {
    toast.add({
      title: "Erreur",
      description: result.error?.message ?? "Une erreur est survenue.",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
  }
}
</script>

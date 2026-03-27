<template>
  <div class="auth-reset-password">
    <div v-if="!done">
      <h1 class="text-3xl font-bold mb-2" :class="theme.titleColor">
        {{ title }}
      </h1>
      <p class="mb-8" :class="theme.subtitleColor">{{ subtitle }}</p>

      <UForm
        :schema="schema"
        :state="form"
        @submit="handleSubmit"
        class="space-y-4"
      >
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
            :color="theme.color"
            class="w-full"
            :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
          >
            <template #trailing>
              <UButton
                :color="theme.color"
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
            :color="theme.color"
            class="w-full"
            :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="loading"
          :disabled="loading"
          :color="theme.btnColor"
          :variant="theme.btnVariant"
          size="lg"
          trailing-icon="i-lucide-key-round"
          class="w-full font-semibold py-3.5 mt-2 justify-center"
          :class="theme.btnRounded"
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
        <UIcon
          name="i-heroicons-check-circle"
          class="w-8 h-8"
          :class="theme.accentColor"
        />
      </div>
      <h2 class="text-2xl font-bold mb-3" :class="theme.titleColor">
        Mot de passe réinitialisé !
      </h2>
      <p class="mb-8" :class="theme.subtitleColor">
        Votre mot de passe a été mis à jour avec succès.
      </p>
      <UButton
        :color="theme.btnSecondaryColor"
        :variant="theme.btnSecondaryVariant"
        size="md"
        trailing-icon="i-lucide-log-in"
        class="font-semibold py-3.5 w-full justify-center"
        :class="theme.btnSecondaryRounded"
        @click="$emit('back-to-login')"
      >
        Se connecter
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { z } from "zod";
import { useAuth } from "../../composables/useAuth";
import { useRoute } from "#app";
import { useToast } from "#imports";
import { useFormTheme, type FormTheme } from "../../composables/useFormTheme";

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    ui?: Partial<FormTheme>;
  }>(),
  {
    title: "Nouveau mot de passe",
    subtitle: "Choisissez un nouveau mot de passe sécurisé.",
    ui: () => ({}),
  },
);

const theme = computed(() => useFormTheme(props.ui));
defineEmits<{ "back-to-login": [] }>();

const schema = z
  .object({
    password: z.string().min(8, "Minimum 8 caractères"),
    password_confirmation: z
      .string()
      .min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((d) => d.password === d.password_confirmation, {
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
  if (!form.email || !form.token) {
    toast.add({
      title: "Champs manquants",
      description: "Email ou token invalide.",
      icon: "i-heroicons-exclamation-triangle",
      color: "error",
    });
    return;
  }

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

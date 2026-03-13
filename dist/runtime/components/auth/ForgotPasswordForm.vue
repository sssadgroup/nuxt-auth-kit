<template>
  <div class="auth-forgot-password">
    <div v-if="!sent">
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

        <UButton
          type="submit"
          :loading="loading"
          :disabled="loading"
          color="neutral"
          size="lg"
          trailing-icon="i-lucide-send"
          class="w-full font-semibold py-3.5 rounded-full mt-2 justify-center"
        >
          {{
            loading
              ? "Envoi en cours..."
              : "Envoyer le lien de réinitialisation"
          }}
        </UButton>
      </UForm>
    </div>

    <div v-else class="text-center">
      <div
        class="w-16 h-16 bg-[#1B4332]/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <UIcon
          name="i-hugeicons-mail-account-02"
          class="w-8 h-8 text-[#1B4332]"
        />
      </div>
      <h2 class="text-2xl font-bold text-[#1a2e1a] mb-3">Email envoyé !</h2>
      <p class="text-[#6b7c6b] mb-8">
        Si un compte existe pour <strong>{{ form.email }}</strong
        >, vous recevrez un lien de réinitialisation sous peu.
      </p>
      <button
        type="button"
        @click="
          sent = false;
          form.email = '';
        "
        class="text-[#1B4332] font-semibold hover:underline text-sm"
      >
        Utiliser un autre email
      </button>
    </div>

    <div class="text-center mt-6">
      <UButton
        type="button"
        @click="$emit('back-to-login')"
        color="secondary"
        variant="subtle"
        size="md"
        leading-icon="i-lucide-arrow-left"
        class="font-semibold py-3.5 rounded-full w-full justify-center"
      >
        Retour à la connexion
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { z } from "zod";
import { useAuth } from "../../composables/useAuth";
import { useToast } from "#imports";

withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: "Mot de passe oublié ?",
    subtitle:
      "Saisissez votre email pour recevoir un lien de réinitialisation.",
  },
);

defineEmits<{ "back-to-login": [] }>();

const schema = z.object({
  email: z.string().email("Email invalide"),
});

const { forgotPassword, loading } = useAuth();
const toast = useToast();

const form = reactive({ email: "" });
const sent = ref(false);

async function handleSubmit() {
  const result = await forgotPassword({ email: form.email });

  if (result.success) {
    sent.value = true;
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

<template>
  <div class="profile-update-password">
    <h2 class="text-2xl font-bold text-[#1a2e1a] mb-6">{{ title }}</h2>

    <UForm :schema="schema" :state="form" @submit="handleSubmit" class="space-y-5">
      <UFormField
        label="Mot de passe actuel"
        name="current_password"
        required
        class="mt-4"
      >
        <UInput
          v-model="form.current_password"
          size="lg"
          :type="show.current ? 'text' : 'password'"
          placeholder="Votre mot de passe actuel"
          icon="i-hugeicons-square-lock-02"
          color="neutral"
          class="w-full"
          :ui="{ base: 'rounded-xl py-3 text-base' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show.current ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="show.current = !show.current"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField label="Nouveau mot de passe" name="password" required class="mt-4">
        <UInput
          v-model="form.password"
          size="lg"
          :type="show.new ? 'text' : 'password'"
          placeholder="Minimum 8 caractères"
          icon="i-hugeicons-square-lock-02"
          color="neutral"
          class="w-full"
          :ui="{ base: 'rounded-xl py-3 text-base' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="show.new ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="show.new = !show.new"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField
        label="Confirmer le nouveau mot de passe"
        name="password_confirmation"
        required
        class="mt-4"
      >
        <UInput
          v-model="form.password_confirmation"
          size="lg"
          :type="show.new ? 'text' : 'password'"
          placeholder="Confirmez votre nouveau mot de passe"
          icon="i-hugeicons-square-lock-02"
          color="neutral"
          class="w-full"
          :ui="{ base: 'rounded-xl py-3 text-base' }"
        />
      </UFormField>

      <UButton
        type="submit"
        :loading="loading"
        :disabled="loading"
        color="neutral"
        size="lg"
        trailing-icon="i-lucide-key-round"
        class="font-semiboldpy-3.5 rounded-xl mt-2 justify-center"
      >
        {{ loading ? "Modification..." : "Changer le mot de passe" }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { z } from "zod";
import { useAuth } from "../../composables/useAuth";
import { useToast } from "#imports";


withDefaults(defineProps<{ title?: string }>(), {
  title: "Changer le mot de passe",
});

const schema = z
  .object({
    current_password: z.string().min(1, "Le mot de passe actuel est requis"),
    password: z.string().min(8, "Minimum 8 caractères"),
    password_confirmation: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

const { updatePassword, loading } = useAuth();
const toast = useToast();

const form = reactive({
  current_password: "",
  password: "",
  password_confirmation: "",
});
const show = reactive({ current: false, new: false });

async function handleSubmit() {
  const result = await updatePassword(form);

  if (result.success) {
    toast.add({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été mis à jour avec succès.",
      icon: "i-heroicons-check-circle",
      color: "success",
    });
    form.current_password = "";
    form.password = "";
    form.password_confirmation = "";
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

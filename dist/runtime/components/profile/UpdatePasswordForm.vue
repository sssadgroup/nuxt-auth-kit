<template>
  <div class="profile-update-password">
    <h2 class="text-2xl font-bold mb-6" :class="theme.titleColor">
      {{ title }}
    </h2>

    <UForm
      :schema="schema"
      :state="form"
      @submit="handleSubmit"
      class="space-y-5"
    >
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
          :color="theme.color"
          class="w-full"
          :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
        >
          <template #trailing>
            <UButton
              :color="theme.color"
              variant="link"
              size="sm"
              :icon="show.current ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="show.current = !show.current"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField
        label="Nouveau mot de passe"
        name="new_password"
        required
        class="mt-4"
      >
        <UInput
          v-model="form.new_password"
          size="lg"
          :type="show.new ? 'text' : 'password'"
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
              :icon="show.new ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              @click="show.new = !show.new"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField
        label="Confirmer le nouveau mot de passe"
        name="new_password_confirmation"
        required
        class="mt-4"
      >
        <UInput
          v-model="form.new_password_confirmation"
          size="lg"
          :type="show.new ? 'text' : 'password'"
          placeholder="Confirmez votre nouveau mot de passe"
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
        class="py-3.5 mt-2 justify-center"
        :class="theme.btnRounded"
      >
        {{ loading ? "Modification..." : "Changer le mot de passe" }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { z } from "zod";
import { useAuth } from "../../composables/useAuth";
import { useToast } from "#imports";
import { useFormTheme, type FormTheme } from "../../composables/useFormTheme";

const props = withDefaults(
  defineProps<{
    title?: string;
    ui?: Partial<FormTheme>;
  }>(),
  {
    title: "Changer le mot de passe",
    ui: () => ({}),
  },
);

const theme = computed(() => useFormTheme(props.ui));

const schema = z
  .object({
    current_password: z.string().min(1, "Le mot de passe actuel est requis"),
    new_password: z.string().min(8, "Minimum 8 caractères"),
    new_password_confirmation: z
      .string()
      .min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((d) => d.new_password === d.new_password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["new_password_confirmation"],
  });

const { updatePassword, loading } = useAuth();
const toast = useToast();
const form = reactive({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
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
    form.new_password = "";
    form.new_password_confirmation = "";
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

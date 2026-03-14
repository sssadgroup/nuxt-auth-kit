<template>
  <div class="profile-update">
    <h2 class="text-2xl font-bold text-[#1a2e1a] mb-6">{{ title }}</h2>

    <div v-if="showAvatar" class="flex items-center gap-4 mb-8">
      <div class="relative group">
        <div
          class="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br bg-[#1A3F7A] text-white font-semibold text-sm cursor-pointer shadow-sm"
        >
          {{ getInitials(user?.first_name, user?.last_name) }}
        </div>

        <label
          class="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 shadow cursor-pointer transition hover:bg-gray-50 group-hover:scale-105"
        >
          <UIcon name="i-lucide-camera" class="w-3.5 h-3.5 text-gray-600" />
          <input
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarChange"
          />
        </label>
      </div>

      <div class="flex flex-col leading-tight">
        <p class="text-sm font-semibold text-gray-900">
          {{ fullName }}
        </p>
        <p class="text-xs text-gray-500">
          {{ user?.email }}
        </p>
      </div>
    </div>

    <UForm :schema="schema" :state="form" @submit="handleSubmit" class="space-y-5">
      <div class="grid grid-cols-2 gap-4 mt-4">
        <UFormField label="Prénom" name="first_name">
          <UInput
            v-model="form.first_name"
            size="lg"
            :placeholder="user?.first_name || 'Prénom'"
            icon="i-lucide-user"
            color="neutral"
            class="w-full"
            :ui="{ base: 'rounded-xl py-3 text-base' }"
          />
        </UFormField>

        <UFormField label="Nom" name="last_name">
          <UInput
            v-model="form.last_name"
            size="lg"
            :placeholder="user?.last_name || 'Nom'"
            icon="i-lucide-user"
            color="neutral"
            class="w-full"
            :ui="{ base: 'rounded-xl py-3 text-base' }"
          />
        </UFormField>
      </div>

      <UFormField label="Email" name="email" class="mt-4">
        <UInput
          v-model="form.email"
          size="lg"
          type="email"
          :placeholder="user?.email || 'votre@email.com'"
          icon="i-hugeicons-mail-account-02"
          color="neutral"
          class="w-full"
          :ui="{ base: 'rounded-xl py-3 text-base' }"
        />
      </UFormField>

      <slot name="extra-fields" :form="form" />

      <UButton
        type="submit"
        :loading="loading"
        :disabled="loading"
        color="neutral"
        size="lg"
        trailing-icon="i-lucide-save"
        class="font-semiboldpy-3.5 rounded-xl mt-2 justify-center"
      >
        {{ loading ? "Enregistrement..." : "Enregistrer les modifications" }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { z } from "zod";
import { useAuth } from "../../composables/useAuth";
import { useToast } from "#imports";

withDefaults(
  defineProps<{
    title?: string;
    showAvatar?: boolean;
  }>(),
  {
    title: "Informations du profil",
    showAvatar: true,
  }
);

const emit = defineEmits<{ success: [user: any] }>();

const { user, updateProfile, loading } = useAuth();
const toast = useToast();

const schema = z.object({
  first_name: z.string().min(2, "Minimum 2 caractères").optional().or(z.literal("")),
  last_name: z.string().min(2, "Minimum 2 caractères").optional().or(z.literal("")),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
});

const form = reactive({
  first_name: user?.first_name || "",
  last_name: user?.last_name || "",
  email: user?.email || "",
  avatar: null as File | null,
});

const avatarPreview = ref<string | null>((user?.avatar as string) || null);

const fullName = computed(() => {
  const first = form.first_name || user?.first_name || "";
  const last = form.last_name || user?.last_name || "";
  return `${first} ${last}`.trim() || "—";
});

const getInitials = (firstName?: string, lastName?: string) => {
  const firstInitials =
    firstName
      ?.trim()
      .split(" ")
      .map((p) => p[0]?.toUpperCase())
      .join("") ?? "";
  const lastInitial = lastName?.[0]?.toUpperCase() ?? "";
  return `${firstInitials}${lastInitial}`;
};

function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  form.avatar = file;
  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarPreview.value = ev.target?.result as string;
  };
  reader.readAsDataURL(file);
}

async function handleSubmit() {
  const data: any = {};
  if (form.first_name) data.first_name = form.first_name;
  if (form.last_name) data.last_name = form.last_name;
  if (form.email) data.email = form.email;
  if (form.avatar) data.avatar = form.avatar;

  const result = await updateProfile(data);

  if (result.success) {
    toast.add({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
      icon: "i-heroicons-check-circle",
      color: "success",
    });
    emit("success", user);
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

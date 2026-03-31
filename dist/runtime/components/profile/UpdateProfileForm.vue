<template>
  <div class="profile-update">
    <h2 class="text-2xl font-bold mb-6" :class="theme.titleColor">
      {{ title }}
    </h2>

    <!-- Avatar -->
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
        <p class="text-sm font-semibold text-gray-900">{{ fullName }}</p>
        <p class="text-xs text-gray-500">{{ user?.email }}</p>
      </div>
    </div>

    <UForm
      :schema="schema"
      :state="form"
      @submit="handleSubmit"
      class="space-y-5"
    >
      <!-- Grille prénom/nom — grid-cols-2 si les deux visibles, grid-cols-1 sinon -->
      <div
        class="grid gap-4 mt-4"
        :class="
          show('first_name') && show('last_name')
            ? 'grid-cols-2'
            : 'grid-cols-1'
        "
      >
        <UFormField v-if="show('first_name')" label="Prénom" name="first_name">
          <UInput
            v-model="form.first_name"
            size="lg"
            :placeholder="user?.first_name || 'Prénom'"
            icon="i-lucide-user"
            :color="theme.color"
            class="w-full"
            :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
          />
        </UFormField>

        <UFormField v-if="show('last_name')" label="Nom" name="last_name">
          <UInput
            v-model="form.last_name"
            size="lg"
            :placeholder="user?.last_name || 'Nom'"
            icon="i-lucide-user"
            :color="theme.color"
            class="w-full"
            :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
          />
        </UFormField>
      </div>

      <UFormField v-if="show('email')" label="Email" name="email" class="mt-4">
        <UInput
          v-model="form.email"
          size="lg"
          type="email"
          :placeholder="user?.email || 'votre@email.com'"
          icon="i-hugeicons-mail-account-02"
          :color="theme.color"
          class="w-full"
          :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
        />
      </UFormField>

      <UFormField
        v-if="show('phone')"
        label="Téléphone"
        name="phone"
        class="mt-4"
      >
        <PhoneInput
          ref="phoneInputRef"
          v-model="form.phone"
          v-model:country-code="form.phoneCountry"
          :preferred-countries="['SN']"
          :use-browser-locale="true"
          :ui="ui"
          @data="onPhoneData"
        />
      </UFormField>

      <slot name="extra-fields" :form="form" />

      <UButton
        type="submit"
        :loading="loading"
        :disabled="loading"
        :color="theme.btnColor"
        :variant="theme.btnVariant"
        size="lg"
        trailing-icon="i-lucide-save"
        class="py-3.5 mt-2 justify-center"
        :class="theme.btnRounded"
      >
        {{ loading ? "Enregistrement..." : "Enregistrer les modifications" }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { z } from "zod";
import { useAuth } from "../../composables/useAuth";
import { useToast } from "#imports";
import { useFormTheme, type FormTheme } from "../../composables/useFormTheme";
import PhoneInput from "../../ui/PhoneInput.vue";

type Field = "first_name" | "last_name" | "email" | "phone";

const props = withDefaults(
  defineProps<{
    title?: string;
    showAvatar?: boolean;
    except?: Field[];
    ui?: Partial<FormTheme>;
  }>(),
  {
    title: "Informations du profil",
    showAvatar: false,
    except: () => [],
    ui: () => ({}),
  },
);

const theme = computed(() => useFormTheme(props.ui));
const show = (field: Field) => !props.except.includes(field);

const emit = defineEmits<{ success: [user: any] }>();

const { user, updateProfile, loading } = useAuth();
const toast = useToast();

const schema = z.object({
  first_name: show("first_name")
    ? z.string().min(2, "Minimum 2 caractères")
    : z.string().optional(),
  last_name: show("last_name")
    ? z.string().min(2, "Minimum 2 caractères")
    : z.string().optional(),
  email: show("email")
    ? z.string().email("Email invalide")
    : z.string().optional(),
  phone: show("phone")
    ? z.string().min(8, "Numéro de téléphone invalide")
    : z.string().optional(),
});

const form = reactive({
  first_name: user?.first_name || "",
  last_name: user?.last_name || "",
  email: user?.email || "",
  phone: user?.phone || "",
  phoneCountry: "SN" as any,
  avatar: null as File | null,
});

function onPhoneData(data: any) {
  if (data.e164) form.phone = data.e164;
}

const avatarPreview = ref<string | null>((user?.avatar as string) || null);

const fullName = computed(() => {
  const first = form.first_name || user?.first_name || "";
  const last = form.last_name || user?.last_name || "";
  return `${first} ${last}`.trim() || "—";
});

const getInitials = (firstName?: string, lastName?: string) => {
  const f =
    firstName
      ?.trim()
      .split(" ")
      .map((p) => p[0]?.toUpperCase())
      .join("") ?? "";
  const l = lastName?.[0]?.toUpperCase() ?? "";
  return `${f}${l}`;
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
  if (show("first_name") && form.first_name) data.first_name = form.first_name;
  if (show("last_name") && form.last_name) data.last_name = form.last_name;
  if (show("email") && form.email) data.email = form.email;
  if (show("phone") && form.phone) data.phone = form.phone;
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

const phoneInputRef = ref<any>(null);
onMounted(async () => {
  await nextTick();
  const input = phoneInputRef.value?.$el?.querySelector("input");

  if (input) {
    input.focus();

    setTimeout(() => {
      input.blur();
    }, 50);
  }
});
</script>

<template>
  <div class="auth-register">
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
      <div :class="except.length === 2 ? '' : 'flex gap-2'">
        <UFormField label="Prénom" name="first_name" required class="mt-6">
          <UInput
            v-model="form.first_name"
            class="w-full"
            size="xl"
            placeholder="Prénom"
            icon="i-lucide-user"
            :color="theme.color"
            :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
          />
        </UFormField>

        <UFormField label="Nom" name="last_name" required class="mt-6">
          <UInput
            v-model="form.last_name"
            class="w-full"
            size="xl"
            placeholder="Nom"
            icon="i-lucide-user"
            :color="theme.color"
            :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
          />
        </UFormField>
      </div>

      <UFormField label="Email" name="email" required class="mt-6">
        <UInput
          v-model="form.email"
          class="w-full"
          size="xl"
          placeholder="votre@email.com"
          icon="i-hugeicons-mail-account-02"
          :color="theme.color"
          :ui="{ base: `${theme.inputRounded} py-3 text-base` }"
        />
      </UFormField>

      <UFormField
        v-if="show('phone')"
        label="Téléphone"
        name="phone"
        class="mt-6"
      >
        <PhoneInput
          v-model="form.phone"
          v-model:country-code="form.phoneCountry"
          :preferred-countries="['SN', 'FR', 'CI']"
          :use-browser-locale="true"
          :ui="ui"
          @data="onPhoneData"
        />
      </UFormField>

      <template v-if="show('password')">
        <UFormField label="Mot de passe" name="password" required class="mt-6">
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
      </template>

      <UButton
        type="submit"
        :loading="loading"
        :disabled="loading"
        :color="theme.btnColor"
        :variant="theme.btnVariant"
        size="lg"
        trailing-icon="i-lucide-user-plus"
        class="w-full font-semibold py-3.5 mt-2 justify-center"
        :class="theme.btnRounded"
      >
        {{ loading ? "Création en cours..." : "Créer un compte" }}
      </UButton>
    </UForm>

    <div v-if="show('password')" class="text-center mt-6">
      <div class="mb-2 text-sm" :class="theme.subtitleColor">
        Déjà un compte ?
      </div>
      <UButton
        type="button"
        @click="$emit('login')"
        :color="theme.btnSecondaryColor"
        :variant="theme.btnSecondaryVariant"
        size="md"
        leading-icon="i-lucide-arrow-left"
        class="font-semibold py-3.5 w-full justify-center"
        :class="theme.btnSecondaryRounded"
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
import { useToast } from "#imports";
import { useFormTheme, type FormTheme } from "../../composables/useFormTheme";
import PhoneInput from "../../ui/PhoneInput.vue";

type Field = "password" | "phone";

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    except?: Field[];
    ui?: Partial<FormTheme>;
  }>(),
  {
    title: "Créer un compte",
    subtitle: "Rejoignez-nous dès aujourd'hui.",
    except: () => [],
    ui: () => ({}),
  },
);

const theme = computed(() => useFormTheme(props.ui));
const show = (field: Field) => !props.except.includes(field);

const emit = defineEmits<{ login: []; success: [user: any] }>();

const schema = computed(() => {
  const base = z.object({
    first_name: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    phone: show("phone")
      ? z.string().min(8, "Numéro de téléphone invalide")
      : z.string().optional(),
    password: show("password")
      ? z.string().min(8, "Minimum 8 caractères")
      : z.string().optional(),
    password_confirmation: show("password")
      ? z.string().min(1, "Veuillez confirmer le mot de passe")
      : z.string().optional(),
  });
  if (show("password")) {
    return base.refine((d) => d.password === d.password_confirmation, {
      message: "Les mots de passe ne correspondent pas",
      path: ["password_confirmation"],
    });
  }
  return base;
});

const { register, loading } = useAuth();
const toast = useToast();

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  phoneCountry: "SN" as any,
  password: "",
  password_confirmation: "",
});

function onPhoneData(data: any) {
  if (data.e164) form.phone = data.e164;
}
const showPassword = ref(false);

async function handleSubmit() {
  const payload: Record<string, any> = {
    first_name: form.first_name,
    last_name: form.last_name,
    email: form.email,
  };
  if (show("phone") && form.phone) payload.phone = form.phone;
  if (show("password")) {
    payload.password = form.password;
    payload.password_confirmation = form.password_confirmation;
  }
  const result = await register(payload as any);
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

<template>
  <div class="relative w-full" ref="triggerRef">
    <!-- ─── Bloc input unifié ────────────────────────────────────────────────── -->
    <div
      class="flex w-full bg-white border transition-all duration-150 overflow-hidden"
      :class="[
        inputRoundedClass,
        hasError
          ? 'border-error ring-1 ring-red-300'
          : isFocused || isOpen
            ? 'border-gray-400 ring-1 ring-gray-200'
            : 'border-gray-200 hover:border-gray-300',
        props.disabled ? 'opacity-50 bg-gray-50' : '',
      ]"
    >
      <!-- Sélecteur de pays -->
      <button
        type="button"
        class="flex items-center gap-1.5 px-3 shrink-0 border-r border-gray-200 bg-transparent focus:outline-none transition-colors duration-100"
        :class="
          props.disabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:bg-gray-50'
        "
        :disabled="props.disabled"
        @click="toggleDropdown"
        @keydown.escape="closeDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
      >
        <span
          class="text-xl leading-none"
          role="img"
          :aria-label="selectedCountry?.name"
        >
          {{ selectedCountry ? countryFlag(selectedCountry.code) : "🌍" }}
        </span>
        <span
          class="text-sm font-medium text-gray-500 tabular-nums whitespace-nowrap"
        >
          +{{ selectedCountry?.dial }}
        </span>
        <svg
          width="14"
          height="14"
          class="text-gray-400 shrink-0 transition-transform duration-200"
          :class="isOpen ? 'rotate-180' : ''"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Champ numéro -->
      <div class="relative flex-1 flex items-center">
        <input
          ref="inputRef"
          v-model="displayValue"
          type="tel"
          inputmode="tel"
          class="w-full p-3 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none"
          :class="props.disabled ? 'cursor-not-allowed' : ''"
          :placeholder="currentPlaceholder"
          :disabled="props.disabled"
          :aria-invalid="hasError"
          autocomplete="tel"
          @input="onInput"
          @focus="isFocused = true"
          @blur="onBlur"
          @keydown.escape="closeDropdown"
        />
        <!-- Check vert si valide -->
        <span
          v-if="displayValue.replace(/\D/g, '').length >= 7 && isValid"
          class="p-3 text-green-500 pointer-events-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="text-green-500"
          >
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    </div>

    <!-- ─── Erreur ───────────────────────────────────────────────────────────── -->
    <p v-if="hasError && errorMessage" class="mt-2 text-error">
      {{ errorMessage }}
    </p>

    <!-- ─── Dropdown pays ────────────────────────────────────────────────────── -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute top-full left-0 mt-1.5 z-50 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
      >
        <!-- Recherche -->
        <div class="p-2.5 border-b border-gray-100">
          <div
            class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
          >
            <svg
              width="14"
              height="14"
              class="text-gray-400 shrink-0 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              ref="searchRef"
              v-model="searchQuery"
              type="text"
              class="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-w-0"
              placeholder="Rechercher un pays..."
              @keydown.escape="closeDropdown"
              @keydown.enter.prevent="selectFirstResult"
            />
          </div>
        </div>

        <!-- Liste -->
        <ul
          ref="listRef"
          class="max-h-60 overflow-y-auto py-1.5 px-1.5"
          role="listbox"
        >
          <!-- Pays préférés -->
          <template v-if="!searchQuery && preferredCountriesList.length">
            <li
              v-for="country in preferredCountriesList"
              :key="`pref-${country.code}`"
              class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer text-sm transition-colors duration-100"
              :class="
                selectedCountry?.code === country.code
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              "
              role="option"
              :aria-selected="selectedCountry?.code === country.code"
              @click="selectCountry(country)"
            >
              <span class="text-lg leading-none shrink-0">{{
                countryFlag(country.code)
              }}</span>
              <span class="flex-1 truncate">{{ country.name }}</span>
              <span
                class="text-xs text-gray-400 font-mono tabular-nums shrink-0"
                >+{{ country.dial }}</span
              >
            </li>
            <li class="my-1 mx-2 h-px bg-gray-100" aria-hidden="true" />
          </template>

          <!-- Tous les pays -->
          <li
            v-for="country in filteredCountries"
            :key="country.code"
            class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer text-sm transition-colors duration-100"
            :class="
              selectedCountry?.code === country.code
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            "
            role="option"
            :aria-selected="selectedCountry?.code === country.code"
            @click="selectCountry(country)"
          >
            <span class="text-lg leading-none shrink-0">{{
              countryFlag(country.code)
            }}</span>
            <span class="flex-1 truncate">{{ country.name }}</span>
            <span class="text-xs text-gray-400 font-mono tabular-nums shrink-0"
              >+{{ country.dial }}</span
            >
          </li>

          <li
            v-if="filteredCountries.length === 0"
            class="px-3 py-5 text-sm text-center text-gray-400"
          >
            Aucun pays trouvé
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import {
  getCountries,
  getCountryCallingCode,
  AsYouType,
  type CountryCode,
} from "libphonenumber-js";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { useFormTheme, type FormTheme } from "../composables/useFormTheme";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Country {
  code: CountryCode;
  name: string;
  dial: string;
}

export interface PhoneInputData {
  e164: string | null;
  countryCode: CountryCode | null;
  formatted: string;
  isValid: boolean;
}

// ─── Props ──────────────────────────────────────────────────────────────────────
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    countryCode?: CountryCode | string;
    defaultCountry?: string;
    preferredCountries?: string[];
    onlyCountries?: string[];
    ignoredCountries?: string[];
    useBrowserLocale?: boolean;
    placeholder?: string;
    disabled?: boolean;
    error?: string | boolean;
    ui?: Partial<FormTheme>;
  }>(),
  {
    modelValue: "",
    preferredCountries: () => [],
    onlyCountries: () => [],
    ignoredCountries: () => [],
    useBrowserLocale: true,
    disabled: false,
    ui: () => ({}),
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:countryCode": [code: CountryCode];
  data: [data: PhoneInputData];
}>();

// ─── Theme ──────────────────────────────────────────────────────────────────────
const theme = computed(() => useFormTheme(props.ui));

// Mappe le token inputRounded vers la classe appliquée au conteneur
const inputRoundedClass = computed(() => {
  const r = theme.value.inputRounded;
  if (r === "rounded-full") return "rounded-full";
  if (r === "rounded-xl") return "rounded-xl";
  if (r === "rounded-lg") return "rounded-lg";
  if (r === "rounded-md") return "rounded-md";
  if (r === "rounded-sm") return "rounded-sm";
  return r;
});

// ─── Noms de pays ───────────────────────────────────────────────────────────────
const displayNames = new Intl.DisplayNames(["fr"], { type: "region" });

// ─── Données pays ───────────────────────────────────────────────────────────────
const allCountries = computed<Country[]>(() => {
  let codes = getCountries() as CountryCode[];
  if (props.onlyCountries.length)
    codes = codes.filter((c) => props.onlyCountries.includes(c));
  if (props.ignoredCountries.length)
    codes = codes.filter((c) => !props.ignoredCountries.includes(c));
  return codes
    .map((code) => ({
      code,
      name: displayNames.of(code) ?? code,
      dial: getCountryCallingCode(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
});

const preferredCountriesList = computed<Country[]>(
  () =>
    props.preferredCountries
      .map((c) => allCountries.value.find((x) => x.code === c))
      .filter(Boolean) as Country[],
);

// ─── État ────────────────────────────────────────────────────────────────────────
const selectedCountry = ref<Country | null>(null);
const displayValue = ref("");
const isOpen = ref(false);
const isFocused = ref(false);
const searchQuery = ref("");
const isValid = ref(false);

const searchRef = ref<HTMLInputElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);

// ─── Pays filtrés ───────────────────────────────────────────────────────────────
const filteredCountries = computed<Country[]>(() => {
  if (!searchQuery.value) return allCountries.value;
  const q = searchQuery.value.toLowerCase();
  return allCountries.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.toLowerCase().includes(q),
  );
});

// ─── Placeholder ────────────────────────────────────────────────────────────────
const currentPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  if (!selectedCountry.value) return "Numéro de téléphone";
  const examples: Record<string, string> = {
    SN: "77 123 45 67",
    FR: "06 12 34 56 78",
    US: "(201) 555-0123",
    GB: "07911 123456",
    MA: "06 12 34 56 78",
    CI: "07 12 34 56 78",
    CM: "6 71 23 45 67",
    GN: "621 12 34 56",
    ML: "65 12 34 56",
    BF: "70 12 34 56",
    TG: "90 12 34 56",
    BJ: "96 12 34 56",
    DE: "030 12345678",
    ES: "612 34 56 78",
    IT: "312 345 6789",
    CA: "(204) 555-0123",
    NG: "0801 234 5678",
    GH: "024 123 4567",
    BE: "0478 12 34 56",
    CH: "078 123 45 67",
  };
  return examples[selectedCountry.value.code] ?? "Numéro de téléphone";
});

// ─── Erreur ──────────────────────────────────────────────────────────────────────
const hasError = computed(
  () =>
    !!props.error ||
    (displayValue.value.length > 3 && !isValid.value && !isFocused.value),
);
const errorMessage = computed(() => {
  if (typeof props.error === "string") return props.error;
  if (displayValue.value.length > 3 && !isValid.value)
    return "Numéro de téléphone invalide";
  return "";
});

// ─── Drapeau emoji ───────────────────────────────────────────────────────────────
function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join("");
}

// ─── Sélection pays ──────────────────────────────────────────────────────────────
function selectCountry(country: Country) {
  selectedCountry.value = country;
  closeDropdown();
  if (displayValue.value) {
    const formatter = new AsYouType(country.code as CountryCode);
    displayValue.value = formatter.input(displayValue.value.replace(/\D/g, ""));
  }
  emit("update:countryCode", country.code);
  nextTick(() => inputRef.value?.focus());
  emitData();
}

// ─── Input ──────────────────────────────────────────────────────────────────────
function onInput() {
  if (!selectedCountry.value) return;

  // Auto-detect si collage d'un numéro international complet (ex: +33612345678)
  if (displayValue.value.startsWith("+")) {
    const parsed = parsePhoneNumberFromString(displayValue.value);
    if (parsed?.country && parsed.isValid()) {
      const found = allCountries.value.find((c) => c.code === parsed.country);
      if (found) selectedCountry.value = found;
      displayValue.value = parsed.formatNational();
      isValid.value = true;
      emitData();
      return;
    }
    // Numéro international incomplet : retirer le + et continuer
    displayValue.value = displayValue.value.replace(/^\+/, "");
  }

  // Extraire les chiffres bruts
  let raw = displayValue.value.replace(/[^\d]/g, "");

  // Si raw commence par l'indicatif du pays (ex: autocomplete a injecté +2217)
  // → retirer l'indicatif pour ne garder que le numéro national
  const dial = selectedCountry.value.dial;
  if (raw.startsWith(dial) && raw.length > dial.length) {
    raw = raw.slice(dial.length);
  }

  // Formater en temps réel
  const formatter = new AsYouType(selectedCountry.value.code as CountryCode);
  displayValue.value = formatter.input(raw) || raw;

  // Validation avec métadonnées complètes (/max)
  try {
    const parsed = parsePhoneNumberFromString(
      `+${dial}${raw}`,
      selectedCountry.value.code as CountryCode,
    );
    isValid.value = parsed?.isValid() ?? false;
  } catch {
    isValid.value = false;
  }

  emitData();
}

function onBlur() {
  isFocused.value = false;
  emitData();
}

// ─── Émission ────────────────────────────────────────────────────────────────────
function emitData() {
  if (!selectedCountry.value) return;
  const raw = displayValue.value.replace(/[^\d]/g, "");
  const e164 = raw ? `+${selectedCountry.value.dial}${raw}` : null;
  let formatted = displayValue.value;
  let valid = false;
  if (e164) {
    try {
      const p = parsePhoneNumberFromString(e164);
      if (p) {
        formatted = p.formatNational();
        valid = p.isValid();
      }
    } catch {
      /* */
    }
  }
  // Re-validate with max metadata to be sure
  if (e164) {
    try {
      const recheck = parsePhoneNumberFromString(
        e164,
        selectedCountry.value?.code as CountryCode,
      );
      valid = recheck?.isValid() ?? false;
    } catch {
      /* */
    }
  }
  isValid.value = valid;
  emit("update:modelValue", e164 ?? displayValue.value);
  emit("data", {
    e164,
    countryCode: selectedCountry.value.code,
    formatted,
    isValid: valid,
  });
}

// ─── Dropdown ────────────────────────────────────────────────────────────────────
function toggleDropdown() {
  isOpen.value ? closeDropdown() : openDropdown();
}
function openDropdown() {
  isOpen.value = true;
  searchQuery.value = "";
  nextTick(() => searchRef.value?.focus());
}
function closeDropdown() {
  isOpen.value = false;
  searchQuery.value = "";
}
function selectFirstResult() {
  const f = filteredCountries.value[0];
  if (f) selectCountry(f);
}

function onClickOutside(e: MouseEvent) {
  if (
    !triggerRef.value?.contains(e.target as Node) &&
    !dropdownRef.value?.contains(e.target as Node)
  )
    closeDropdown();
}

// ─── Montage ─────────────────────────────────────────────────────────────────────
onMounted(() => {
  document.addEventListener("click", onClickOutside);
  if (props.countryCode) {
    const f = allCountries.value.find((c) => c.code === props.countryCode);
    if (f) {
      selectedCountry.value = f;
      return;
    }
  }
  if (props.defaultCountry) {
    const f = allCountries.value.find((c) => c.code === props.defaultCountry);
    if (f) {
      selectedCountry.value = f;
      return;
    }
  }
  if (props.useBrowserLocale) {
    const region = (navigator.language || navigator.languages?.[0] || "")
      .split("-")[1]
      ?.toUpperCase();
    if (region) {
      const f = allCountries.value.find((c) => c.code === region);
      if (f) {
        selectedCountry.value = f;
        return;
      }
    }
  }
  if (props.preferredCountries.length) {
    const f = allCountries.value.find(
      (c) => c.code === props.preferredCountries[0],
    );
    if (f) {
      selectedCountry.value = f;
      return;
    }
  }
  selectedCountry.value =
    allCountries.value.find((c) => c.code === "SN") ?? allCountries.value[0];
});

onUnmounted(() => document.removeEventListener("click", onClickOutside));

watch(
  () => props.modelValue,
  (val) => {
    if (!val || val === displayValue.value) return;
    if (val.startsWith("+")) {
      const parsed = parsePhoneNumberFromString(val);
      if (parsed?.country) {
        const f = allCountries.value.find((c) => c.code === parsed.country);
        if (f) selectedCountry.value = f;
      }
      displayValue.value = parsed?.formatNational() ?? val;
    } else {
      displayValue.value = val;
    }
  },
  { immediate: true },
);
</script>

/**
 * useFormTheme — tokens de style partagés entre tous les composants nuxt-auth-kit.
 *
 * Emplacement dans le module :
 *   src/runtime/composables/useFormTheme.ts
 *
 * Chaque composant accepte une prop `ui?: Partial<FormTheme>` qui fusionne
 * ces valeurs par défaut. Seuls les tokens à surcharger sont nécessaires.
 *
 * @example
 * <AuthLoginForm
 *   :ui="{
 *     inputRounded:  'rounded-lg',
 *     btnColor:      'primary',
 *     titleColor:    'text-slate-900',
 *     accentColor:   'text-blue-600',
 *   }"
 * />
 */

import type { UiColor, ButtonVariant, Rounded } from "../types/ui";

export interface FormTheme {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  /** Classe border-radius appliquée à tous les UInput */
  inputRounded: Rounded;
  /** Couleur Nuxt UI des UInput (neutral | primary | ...) */
  color: UiColor;

  // ── Bouton principal (submit) ────────────────────────────────────────────────
  /** Border-radius du bouton principal */
  btnRounded: Rounded;
  /** Couleur Nuxt UI du bouton principal */
  btnColor: UiColor;
  /** Variante Nuxt UI du bouton principal (solid | outline | soft | ...) */
  btnVariant: ButtonVariant;

  // ── Boutons secondaires (retour, lien, social) ──────────────────────────────
  /** Couleur Nuxt UI des boutons secondaires */
  btnSecondaryColor: UiColor;
  /** Variante Nuxt UI des boutons secondaires */
  btnSecondaryVariant: ButtonVariant;
  /** Border-radius des boutons secondaires */
  btnSecondaryRounded: Rounded;

  // ── Typographie & couleurs de page ──────────────────────────────────────────
  /** Classe couleur du titre (h1 / h2) */
  titleColor: string;
  /** Classe couleur du sous-titre et des textes secondaires */
  subtitleColor: string;
  /** Classe couleur des liens et accents (mot de passe oublié, s'inscrire…) */
  accentColor: string;

  // ── AuthLayout ───────────────────────────────────────────────────────────────
  /** Couleur du texte principal du panneau droit (appName) — valeur CSS : hex, rgb, hsl */
  layoutTextColor: string;
  /** Couleur de la tagline du panneau droit — valeur CSS : hex, rgb, hsl */
  layoutTaglineColor: string;
  /** Couleur de fond du panneau gauche (formulaire) — valeur CSS : hex, rgb, hsl */
  layoutPageColor: string;
}

/** Défauts — reproduit exactement le style actuel des composants */
export const defaultTheme: FormTheme = {
  inputRounded: "rounded-xl",
  color: "neutral",

  btnRounded: "rounded-xl",
  btnColor: "neutral",
  btnVariant: "solid",

  btnSecondaryColor: "secondary",
  btnSecondaryVariant: "subtle",
  btnSecondaryRounded: "rounded-xl",

  titleColor: "text-[#1a2e1a]",
  subtitleColor: "text-[#6b7c6b]",
  accentColor: "text-[#1B4332]",

  layoutTextColor: "#ffffff",
  layoutTaglineColor: "rgba(255, 255, 255, 0.75)",
  layoutPageColor: "#eeeee6",
};

/** Fusionne les overrides avec les défauts. Utilisé en interne par chaque composant. */
export function useFormTheme(overrides?: Partial<FormTheme>): FormTheme {
  return { ...defaultTheme, ...(overrides ?? {}) };
}

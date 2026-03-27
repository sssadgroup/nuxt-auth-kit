/**
 * useFormTheme — système de tokens de style partagé entre tous les composants
 * nuxt-auth-kit.
 *
 * Chaque composant accepte une prop `ui` partielle qui vient fusionner
 * ces valeurs par défaut. Il suffit de passer uniquement les tokens à
 * surcharger.
 *
 * @example
 * <AuthLoginForm
 *   :ui="{
 *     inputRounded: 'rounded-lg',
 *     color: 'primary',
 *     titleColor: 'text-gray-900',
 *   }"
 * />
 */

import type { UiColor, ButtonVariant, Rounded } from "../types/ui";

export interface FormTheme {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  /** Classe de border-radius appliquée aux champs de saisie */
  inputRounded: Rounded;
  /** Couleur Nuxt UI appliquée à UInput / UButton (neutral | primary | ...) */
  color: UiColor;

  // ── Boutons principaux (submit) ──────────────────────────────────────────────
  /** Classe de border-radius du bouton principal */
  btnRounded: Rounded;
  /** Couleur Nuxt UI du bouton principal */
  btnColor: UiColor;
  /** Variante Nuxt UI du bouton principal */
  btnVariant: ButtonVariant;

  // ── Boutons secondaires (retour, lien) ──────────────────────────────────────
  /** Couleur Nuxt UI des boutons secondaires */
  btnSecondaryColor: UiColor;
  /** Variante Nuxt UI des boutons secondaires */
  btnSecondaryVariant: ButtonVariant;
  /** Classe de border-radius des boutons secondaires */
  btnSecondaryRounded: Rounded;

  // ── Typographie ─────────────────────────────────────────────────────────────
  /** Classe de couleur du titre principal */
  titleColor: string;
  /** Classe de couleur du sous-titre / textes secondaires */
  subtitleColor: string;
  /** Classe de couleur des liens et accents (mot de passe oublié, s'inscrire…) */
  accentColor: string;
  /** Classe de couleur du ring sur le bouton de rôle actif */
  roleRingColor: string;
}

/** Valeurs par défaut — reproduit le style actuel des composants */
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
  roleRingColor: "ring-[#1B4332]",
};

/**
 * Fusionne les tokens fournis par le parent avec les valeurs par défaut.
 * Utilisé en interne par chaque composant.
 */
export function useFormTheme(overrides?: Partial<FormTheme>): FormTheme {
  return { ...defaultTheme, ...(overrides ?? {}) };
}

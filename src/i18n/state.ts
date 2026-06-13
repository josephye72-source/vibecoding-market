import { normalizeLocale, type Dictionary } from "./dictionaries";
import type { Locale } from "./types";

export const LOCALE_STORAGE_KEY = "vcm:locale";

export function getStoredLocale(): Locale {
  try {
    return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return "zh";
  }
}

export function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Locale preference is helpful but not required for core use.
  }
}

export function htmlLangFor(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : "en";
}

export function syncDocumentLocale(locale: Locale): void {
  document.documentElement.lang = htmlLangFor(locale);
}

export function nextLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

export type { Dictionary, Locale };

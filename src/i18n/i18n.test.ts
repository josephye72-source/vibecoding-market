import { describe, expect, it } from "vitest";
import { dictionaries, isLocale, normalizeLocale } from "./dictionaries";

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap((item) => collectStrings(item));
  }

  return [];
}

describe("i18n dictionaries", () => {
  it("supports zh and en while falling back to zh", () => {
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(normalizeLocale("fr")).toBe("zh");
    expect(normalizeLocale(null)).toBe("zh");
  });

  it("contains shell, homepage, feedback, project detail, and demo labels for both locales", () => {
    for (const locale of ["zh", "en"] as const) {
      expect(dictionaries[locale].shell.nav.home).toBeTruthy();
      expect(dictionaries[locale].home.heroLede).toBeTruthy();
      expect(dictionaries[locale].feedback.heading).toBeTruthy();
      expect(dictionaries[locale].projectDetail.openDemo).toBeTruthy();
      expect(dictionaries[locale].demos.memory.moves).toBeTruthy();
      expect(dictionaries[locale].demos.split.copySummary).toBeTruthy();
    }
  });

  it("keeps English project detail copy free of Chinese fallback text", () => {
    for (const projectText of Object.values(dictionaries.en.projects)) {
      const strings = collectStrings(projectText);

      for (const text of strings) {
        expect(text).not.toMatch(/[\u3400-\u9fff]/);
      }
    }
  });
});

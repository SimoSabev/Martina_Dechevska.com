/**
 * Locale registry. The site ships in English only, but every piece of
 * content lives under `content/<locale>/` and every loader takes a locale,
 * so adding a language means: add it here, add its UI strings, duplicate
 * `content/en/` into `content/<locale>/`, and move pages under `app/[locale]`.
 */
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const htmlLang: Record<Locale, string> = {
  en: "en-US",
};

export const ogLocale: Record<Locale, string> = {
  en: "en_US",
};

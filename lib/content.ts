import "server-only";
import { cache } from "react";
import { createReader } from "@keystatic/core/reader";
import Markdoc, { type RenderableTreeNode } from "@markdoc/markdoc";
import keystaticConfig from "@/keystatic.config";
import { defaultLocale, type Locale } from "./i18n";

const reader = createReader(process.cwd(), keystaticConfig);

/**
 * Only the default locale is wired up. When a second language is added,
 * switch on `locale` here and read the suffixed Keystatic keys.
 */
function readerFor(locale: Locale) {
  if (locale !== defaultLocale) {
    throw new Error(`Locale "${locale}" has no content yet.`);
  }
  return reader;
}

async function required<T>(name: string, promise: Promise<T | null>): Promise<T> {
  const value = await promise;
  if (!value) throw new Error(`Missing content: ${name}. Create it in /keystatic.`);
  return value;
}

export const getSettings = cache((locale: Locale = defaultLocale) =>
  required("settings", readerFor(locale).singletons.settings.read()),
);

export const getHome = cache((locale: Locale = defaultLocale) =>
  required("home", readerFor(locale).singletons.home.read()),
);

export const getJournalism = cache((locale: Locale = defaultLocale) =>
  required("journalism", readerFor(locale).singletons.journalism.read()),
);

export const getRealEstate = cache((locale: Locale = defaultLocale) =>
  required("real estate", readerFor(locale).singletons.realEstate.read()),
);

export const getContact = cache((locale: Locale = defaultLocale) =>
  required("contact", readerFor(locale).singletons.contact.read()),
);

export const getAbout = cache(async (locale: Locale = defaultLocale) => {
  const about = await required("about", readerFor(locale).singletons.about.read());
  const { node } = await about.body();
  const errors = Markdoc.validate(node);
  if (errors.length) throw new Error(`Invalid biography markup: ${errors[0].error.message}`);
  const body: RenderableTreeNode = Markdoc.transform(node);
  return { ...about, body };
});

export const getArticles = cache(async (locale: Locale = defaultLocale) => {
  const entries = await readerFor(locale).collections.articles.all();
  return entries
    .map(({ slug, entry }) => ({ slug, ...entry }))
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (b.date ?? "").localeCompare(a.date ?? "");
    });
});

export type Settings = Awaited<ReturnType<typeof getSettings>>;
export type Article = Awaited<ReturnType<typeof getArticles>>[number];

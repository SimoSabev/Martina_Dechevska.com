import type { Metadata } from "next";
import { getSettings } from "./content";
import { defaultLocale, ogLocale } from "./i18n";
import { filled } from "./placeholder";

/**
 * Per-page metadata. Next.js replaces (not merges) a parent's `openGraph`,
 * so the shared fields and the generated share image are repeated here.
 * Placeholder descriptions fall back to the site default.
 */
export async function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description?: string | null;
  path: string;
}): Promise<Metadata> {
  const settings = await getSettings();
  const desc = filled(description) ?? filled(settings.seoDescription);
  const fullTitle = `${title} — ${settings.name}`;
  const image = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${settings.name} — ${settings.roleLine}`,
  };

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: settings.name,
      locale: ogLocale[defaultLocale],
      title: fullTitle,
      description: desc,
      url: path,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [image] },
  };
}

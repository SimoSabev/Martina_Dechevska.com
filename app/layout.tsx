import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { defaultLocale, htmlLang, ogLocale } from "@/lib/i18n";
import { getSettings } from "@/lib/content";
import { filled } from "@/lib/placeholder";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const description = filled(settings.seoDescription);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.name} — ${settings.roleLine}`,
      template: `%s — ${settings.name}`,
    },
    description,
    applicationName: settings.name,
    authors: [{ name: settings.name, url: siteUrl }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: settings.name,
      locale: ogLocale[defaultLocale],
      url: "/",
      description,
    },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f3ec",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={htmlLang[defaultLocale]}
      className={`${cormorant.variable} ${manrope.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

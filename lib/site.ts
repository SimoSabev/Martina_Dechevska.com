export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://martinadechevska.com"
).replace(/\/$/, "");

export const navigation = [
  { href: "/about", label: "About" },
  { href: "/journalism", label: "Journalism" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/contact", label: "Contact" },
] as const;

export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

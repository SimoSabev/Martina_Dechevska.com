import type { getHome, getRealEstate, Settings } from "./content";
import { filled } from "./placeholder";
import { absoluteUrl, siteUrl } from "./site";

type Home = Awaited<ReturnType<typeof getHome>>;
type RealEstate = Awaited<ReturnType<typeof getRealEstate>>;

/** Drops undefined/empty values so placeholders never reach search engines. */
function clean<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)),
  ) as T;
}

const personId = `${siteUrl}/#person`;

export function personSchema(settings: Settings, home?: Home) {
  return clean({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: settings.name,
    url: siteUrl,
    jobTitle: ["Journalist", "Real Estate Broker"],
    description: filled(settings.seoDescription),
    image: home?.portrait ? absoluteUrl(home.portrait) : undefined,
    email: filled(settings.email) ? `mailto:${filled(settings.email)}` : undefined,
    telephone: filled(settings.phone),
    sameAs: [settings.linkedin, settings.instagram, settings.archiveUrl].filter(Boolean),
  });
}

export function realEstateAgentSchema(settings: Settings, realEstate: RealEstate) {
  const brokerage = filled(realEstate.brokerage);
  const areas = realEstate.areas.map(filled).filter(Boolean);
  return clean({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteUrl}/real-estate#agent`,
    name: settings.name,
    url: absoluteUrl("/real-estate"),
    email: filled(settings.email),
    telephone: filled(settings.phone),
    areaServed: areas.length ? areas : undefined,
    parentOrganization: brokerage
      ? clean({
          "@type": "RealEstateAgent",
          name: brokerage,
          address: filled(realEstate.brokerageAddress),
          telephone: filled(realEstate.brokeragePhone),
        })
      : undefined,
  });
}

import Link from "next/link";
import { getRealEstate, getSettings } from "@/lib/content";
import { filled } from "@/lib/placeholder";
import { navigation } from "@/lib/site";
import { EqualHousing } from "./equal-housing";
import { T } from "./text";

export async function Footer() {
  const [settings, realEstate] = await Promise.all([getSettings(), getRealEstate()]);
  const email = filled(settings.email);
  const phone = filled(settings.phone);
  const year = new Date().getFullYear();

  const socials = [
    { label: "LinkedIn", href: settings.linkedin },
    { label: "Instagram", href: settings.instagram },
    { label: "Flowers in a Gun", href: settings.archiveUrl },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="on-dark bg-ink text-ivory">
      <div className="container-site grid gap-14 py-20 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <p className="font-serif text-4xl leading-tight sm:text-5xl">{settings.name}</p>
          <p className="mt-4 text-sm tracking-wide text-mist">{settings.roleLine}</p>
          <p className="mt-1 text-sm tracking-wide text-mist">
            <T>{settings.location}</T>
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-6 space-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ivory/85 transition-colors hover:text-lime">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="eyebrow">Contact</h2>
          <ul className="mt-6 space-y-3 text-ivory/85">
            <li>
              {email ? (
                <a href={`mailto:${email}`} className="transition-colors hover:text-lime">
                  {email}
                </a>
              ) : (
                <T>{settings.email}</T>
              )}
            </li>
            <li>
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="transition-colors hover:text-lime">
                  {phone}
                </a>
              ) : (
                <T>{settings.phone}</T>
              )}
            </li>
          </ul>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mist transition-colors hover:text-lime"
                  >
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Real estate advertising disclosures — wording to be confirmed with the brokerage. */}
      <div className="border-t border-ivory/10">
        <div className="container-site grid gap-8 py-10 text-xs leading-relaxed text-mist md:grid-cols-12">
          <div className="space-y-1 md:col-span-8">
            <p>
              <T>{realEstate.licenseType}</T>, <T>{realEstate.licenseState}</T> · License No.{" "}
              <T>{realEstate.licenseNumber}</T>
            </p>
            <p>
              <T>{realEstate.brokerage}</T> · <T>{realEstate.brokerageAddress}</T> ·{" "}
              <T>{realEstate.brokeragePhone}</T>
            </p>
            {realEstate.disclosures && (
              <p className="pt-2">
                <T>{realEstate.disclosures}</T>
              </p>
            )}
          </div>
          {realEstate.showEqualHousing && (
            <div className="md:col-span-4 md:justify-self-end">
              <EqualHousing className="text-ivory/80" />
            </div>
          )}
        </div>
        <div className="container-site flex flex-col gap-2 border-t border-ivory/10 py-6 text-xs text-mist sm:flex-row sm:justify-between">
          <p>
            © {year} {settings.name}. All rights reserved.
          </p>
          <a href="#main" className="transition-colors hover:text-lime">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

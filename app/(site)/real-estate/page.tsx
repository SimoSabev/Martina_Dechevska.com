import { ArrowLink } from "@/components/arrow-link";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { T } from "@/components/text";
import { getRealEstate, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { realEstateAgentSchema } from "@/lib/structured-data";

export async function generateMetadata() {
  const page = await getRealEstate();
  return pageMetadata({ title: "Real Estate", description: page.intro, path: "/real-estate" });
}

export default async function RealEstatePage() {
  const [settings, page] = await Promise.all([getSettings(), getRealEstate()]);

  return (
    <>
      <JsonLd data={realEstateAgentSchema(settings, page)} />
      <PageHeader index="02" eyebrow="Real Estate" heading={page.heading} intro={page.intro} />

      {/* Services */}
      <section aria-labelledby="services-heading" className="container-site pb-24 md:pb-32">
        <h2 id="services-heading" className="eyebrow">
          Services
        </h2>
        <ol className="mt-10 border-t border-ink">
          {page.services.map((service, i) => (
            <li
              key={i}
              className="grid gap-4 border-b border-sand py-10 md:grid-cols-12 md:items-baseline md:gap-10 md:py-12"
            >
              <span className="font-serif text-lg text-olive italic md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-[2.25rem] leading-tight md:col-span-5 md:text-5xl">
                <T>{service.title}</T>
              </h3>
              <p className="leading-relaxed text-stone md:col-span-6">
                <T>{service.description}</T>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Areas + credentials */}
      <section className="border-y border-sand bg-paper">
        <div className="container-site grid gap-16 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <h2 className="eyebrow">Areas served</h2>
            <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-serif text-[clamp(1.85rem,3.4vw,3rem)] leading-tight">
              {page.areas.map((area, i) => (
                <li key={i}>
                  <T>{area}</T>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <h2 className="eyebrow">Credentials</h2>
            <dl className="mt-10 space-y-6 text-sm">
              {[
                ["Brokerage", page.brokerage],
                ["License", page.licenseType],
                ["State", page.licenseState],
                ["License number", page.licenseNumber],
                ["Office", page.brokerageAddress],
              ].map(([term, value]) => (
                <div key={term} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-sand pb-4">
                  <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-stone uppercase">{term}</dt>
                  <dd className="text-ink">
                    <T>{value}</T>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="on-dark bg-ink text-ivory">
        <div className="container-site grid items-end gap-10 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-8">
            <h2 className="font-serif text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.95]">
              <T>{page.ctaTitle}</T>
            </h2>
            <p className="mt-6 max-w-lg text-lg text-ivory/80">
              <T>{page.ctaText}</T>
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <ArrowLink href="/contact" tone="dark">
              Arrange a consultation
            </ArrowLink>
          </div>
        </div>
      </section>

    </>
  );
}

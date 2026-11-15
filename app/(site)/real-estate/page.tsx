import Image from "next/image";
import { ArrowLink } from "@/components/arrow-link";
import { JsonLd } from "@/components/json-ld";
import { CountUp, ImageReveal, MaskReveal, Parallax, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHeader } from "@/components/page-header";
import { T } from "@/components/text";
import { YouTubeVideo } from "@/components/youtube-video";
import { getRealEstate, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { filled } from "@/lib/placeholder";
import { realEstateAgentSchema } from "@/lib/structured-data";
import { youtubeId } from "@/lib/youtube";

export async function generateMetadata() {
  const page = await getRealEstate();
  return pageMetadata({ title: "Real Estate", description: page.intro, path: "/real-estate" });
}

export default async function RealEstatePage() {
  const [settings, page] = await Promise.all([getSettings(), getRealEstate()]);
  const agentEmail = filled(page.agentEmail);
  const hasVideo = Boolean(youtubeId(page.videoUrl));

  const credentials: [string, string | null | undefined][] = [
    ["Role", page.role],
    ["Team", page.team],
    ["Brokerage", page.brokerage],
    ["License", page.licenseType],
    ["State", page.licenseState],
    ["License number", page.licenseNumber],
    ["Designations", page.memberships],
    ["Office", page.brokerageAddress],
  ];

  return (
    <>
      <JsonLd data={realEstateAgentSchema(settings, page)} />
      <PageHeader index="03" eyebrow="Real Estate" heading={page.heading} intro={page.intro} />

      {/* Photo + results */}
      {(page.photo || page.results.length > 0) && (
        <section className="container-site grid gap-16 pb-24 md:grid-cols-12 md:gap-10 md:pb-32">
          {page.photo && (
            <Parallax className="relative md:col-span-5" distance={24}>
              <Reveal
                y={0}
                delay={0.5}
                duration={1.8}
                className="absolute inset-0 translate-x-4 translate-y-4 border border-olive/40 md:translate-x-6 md:translate-y-6"
              />
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <ImageReveal>
                  <Image
                    src={page.photo}
                    alt={page.photoAlt || settings.name}
                    fill
                    sizes="(min-width: 1344px) 520px, (min-width: 768px) 40vw, 100vw"
                    className="object-cover object-top"
                  />
                </ImageReveal>
              </div>
            </Parallax>
          )}
          {page.results.length > 0 && (
            <div className="flex flex-col justify-end md:col-span-6 md:col-start-7">
              <Reveal as="h2" className="eyebrow" y={12}>
                Selected results
              </Reveal>
              <Stagger as="dl" className="mt-10 border-t border-ink" stagger={0.16} delay={0.2}>
                {page.results.map((result, i) => (
                  <StaggerItem key={i} className="grid gap-3 border-b border-sand py-8 sm:grid-cols-[10rem_1fr] sm:gap-8">
                    <dt className="font-serif text-5xl leading-none text-ink md:text-6xl">
                      <CountUp value={result.value} />
                    </dt>
                    <dd className="self-center leading-relaxed text-stone">
                      <T>{result.label}</T>
                    </dd>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          )}
        </section>
      )}

      {/* Services */}
      <section aria-labelledby="services-heading" className="container-site pb-24 md:pb-32">
        <h2 id="services-heading" className="eyebrow">
          Services
        </h2>
        <Stagger as="ol" className="mt-10 border-t border-ink" stagger={0.12}>
          {page.services.map((service, i) => (
            <StaggerItem
              as="li"
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
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Video */}
      {hasVideo && (
        <section aria-labelledby="re-video-heading" className="container-site pb-24 md:pb-32">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 id="re-video-heading" className="eyebrow">
                On video
              </h2>
              <p className="mt-8 font-serif text-[clamp(1.85rem,3vw,2.5rem)] leading-[1.15]">
                <T>{page.videoTitle}</T>
              </p>
            </div>
            <Reveal delay={0.2} className="md:col-span-8">
              <YouTubeVideo
                url={page.videoUrl}
                title={page.videoTitle || "Real estate video"}
                sizes="(min-width: 768px) 66vw, 100vw"
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Areas + credentials */}
      <section className="border-y border-sand bg-paper">
        <div className="container-site grid gap-16 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <h2 className="eyebrow">Areas served</h2>
            <Stagger as="ul" className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-serif text-[clamp(1.85rem,3.4vw,3rem)] leading-tight" stagger={0.1}>
              {page.areas.map((area, i) => (
                <StaggerItem as="li" key={i}>
                  <T>{area}</T>
                </StaggerItem>
              ))}
            </Stagger>
            {page.areasNote && (
              <p className="mt-10 max-w-lg leading-relaxed text-stone">
                <T>{page.areasNote}</T>
              </p>
            )}
          </div>

          <Reveal delay={0.2} className="md:col-span-4 md:col-start-9">
            <h2 className="eyebrow">Credentials</h2>
            <dl className="mt-10 space-y-6 text-sm">
              {credentials
                .filter(([, value]) => value)
                .map(([term, value]) => (
                  <div key={term} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-sand pb-4">
                    <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-stone uppercase">{term}</dt>
                    <dd className="whitespace-pre-line text-ink">
                      <T>{value}</T>
                    </dd>
                  </div>
                ))}
              {agentEmail && (
                <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-sand pb-4">
                  <dt className="text-[0.68rem] font-semibold tracking-[0.2em] text-stone uppercase">Email</dt>
                  <dd className="break-words text-ink">
                    <a href={`mailto:${agentEmail}`} className="underline decoration-olive underline-offset-4">
                      {agentEmail}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Beyond the city */}
      {page.beyondTitle && (
        <section aria-labelledby="beyond-heading" className="container-site py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow">Beyond the city</p>
              <h2 id="beyond-heading" className="mt-8 font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] italic">
                <MaskReveal>
                  <T>{page.beyondTitle}</T>
                </MaskReveal>
              </h2>
            </div>
            <Reveal delay={0.3} className="flex flex-col justify-end gap-8 md:col-span-6 md:col-start-7">
              {page.beyondText && (
                <p className="text-lg leading-relaxed text-stone">
                  <T>{page.beyondText}</T>
                </p>
              )}
              {page.beyondUrl && (
                <ArrowLink href={page.beyondUrl} target="_blank" rel="noopener noreferrer">
                  {page.beyondLinkLabel || "Visit"}
                  <span className="sr-only"> (opens in a new tab)</span>
                </ArrowLink>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="on-dark bg-ink text-ivory">
        <div className="container-site grid items-end gap-10 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-8">
            <h2 className="font-serif text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.95]">
              <MaskReveal>
                <T>{page.ctaTitle}</T>
              </MaskReveal>
            </h2>
            <Reveal as="p" delay={0.25} className="mt-6 max-w-lg text-lg text-ivory/80">
              <T>{page.ctaText}</T>
            </Reveal>
          </div>
          <Reveal delay={0.4} className="md:col-span-4 md:justify-self-end">
            <ArrowLink href="/contact" tone="dark">
              Arrange a consultation
            </ArrowLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

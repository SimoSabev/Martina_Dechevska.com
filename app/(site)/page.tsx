import { ArrowLink } from "@/components/arrow-link";
import { JsonLd } from "@/components/json-ld";
import { Portrait } from "@/components/portrait";
import { T } from "@/components/text";
import { getHome, getSettings } from "@/lib/content";
import { personSchema } from "@/lib/structured-data";

export default async function HomePage() {
  const [settings, home] = await Promise.all([getSettings(), getHome()]);
  const [firstName, ...rest] = settings.name.split(" ");

  const paths = [
    {
      index: "01",
      title: home.journalismTitle,
      text: home.journalismText,
      href: "/journalism",
      cta: "Read the work",
    },
    {
      index: "02",
      title: home.realEstateTitle,
      text: home.realEstateText,
      href: "/real-estate",
      cta: "Real estate services",
    },
  ];

  return (
    <>
      <JsonLd data={personSchema(settings, home)} />

      {/* Hero */}
      <section className="container-site grid items-end gap-12 pt-14 pb-20 md:grid-cols-12 md:gap-10 md:pt-20 lg:pb-28">
        <div className="md:col-span-7 lg:col-span-7">
          <p className="eyebrow">{settings.roleLine}</p>
          <h1 className="mt-8 font-serif text-display font-medium">
            <span className="block">{firstName}</span>
            <span className="block pl-[0.6em] italic">{rest.join(" ")}</span>
          </h1>
          <p className="mt-10 max-w-xl font-serif text-[1.65rem] leading-snug text-ink sm:text-3xl">
            <T>{home.tagline}</T>
          </p>
          <p className="mt-6 max-w-lg leading-relaxed text-stone">
            <T>{home.intro}</T>
          </p>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:gap-12">
            <ArrowLink href="/journalism">{home.journalismTitle}</ArrowLink>
            <ArrowLink href="/real-estate">{home.realEstateTitle}</ArrowLink>
          </div>
        </div>

        <div className="relative md:col-span-5">
          <div aria-hidden className="absolute -inset-0 translate-x-4 translate-y-4 border border-olive/40 md:translate-x-6 md:translate-y-6" />
          <Portrait
            src={home.portrait}
            alt={home.portraitAlt || settings.name}
            priority
            sizes="(min-width: 1344px) 520px, (min-width: 768px) 40vw, 100vw"
            className="relative"
          />
        </div>
      </section>

      {/* Statement */}
      <section className="on-dark bg-ink text-ivory">
        <div className="container-site py-24 md:py-36">
          <p className="mx-auto max-w-5xl text-center font-serif text-[clamp(2rem,4.6vw,4rem)] leading-[1.12] font-normal">
            <span aria-hidden className="mb-8 block text-lime">—</span>
            <T>{home.statement}</T>
          </p>
        </div>
      </section>

      {/* Two paths */}
      <section aria-labelledby="paths-heading" className="container-site py-24 md:py-32">
        <h2 id="paths-heading" className="eyebrow">
          Two disciplines
        </h2>
        <div className="mt-12 grid border-t border-ink md:grid-cols-2">
          {paths.map((path, i) => (
            <article
              key={path.href}
              className={`group relative flex flex-col justify-between gap-16 border-b border-sand py-12 transition-colors duration-500 hover:bg-paper md:min-h-[26rem] md:p-12 ${i === 0 ? "md:border-r" : ""}`}
            >
              <div>
                <span className="font-serif text-lg text-olive italic">{path.index}</span>
                <h3 className="mt-4 font-serif text-[clamp(2.75rem,5vw,4.5rem)] leading-none">
                  {path.title}
                </h3>
                <p className="mt-6 max-w-md leading-relaxed text-stone">
                  <T>{path.text}</T>
                </p>
              </div>
              <ArrowLink href={path.href} className="after:absolute after:inset-0">
                {path.cta}
              </ArrowLink>
            </article>
          ))}
        </div>
      </section>

      {/* Highlights */}
      {home.highlights.length > 0 && (
        <section aria-label="Highlights" className="border-y border-sand bg-paper">
          <dl className="container-site grid gap-y-12 py-20 sm:grid-cols-3 md:py-24">
            {home.highlights.map((item, i) => (
              <div
                key={i}
                className={`flex flex-col-reverse gap-3 sm:px-8 ${i > 0 ? "sm:border-l sm:border-sand" : "sm:pl-0"}`}
              >
                <dt className="text-[0.7rem] font-semibold tracking-[0.24em] text-stone uppercase">
                  <T>{item.label}</T>
                </dt>
                <dd className="font-serif text-6xl leading-none text-ink md:text-7xl">
                  <T>{item.value}</T>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Contact CTA */}
      <section className="container-site py-24 md:py-36">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <h2 className="font-serif text-[clamp(3rem,7vw,6rem)] leading-[0.95] md:col-span-8">
            Begin with a <span className="italic">conversation.</span>
          </h2>
          <div className="md:col-span-4 md:justify-self-end">
            <ArrowLink href="/contact">Get in touch</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}

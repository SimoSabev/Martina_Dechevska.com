import { ArrowLink } from "@/components/arrow-link";
import { JsonLd } from "@/components/json-ld";
import { CountUp, MaskReveal, Parallax, Reveal, Stagger, StaggerItem } from "@/components/motion";
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
      title: home.literatureTitle,
      text: home.literatureText,
      href: "/literature",
      cta: "The books",
    },
    {
      index: "03",
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
          <Reveal as="p" className="eyebrow" immediate delay={0.1} y={12}>
            {settings.roleLine}
          </Reveal>
          <h1 className="mt-8 font-serif text-display font-medium">
            <MaskReveal immediate delay={0.2}>
              {firstName}
            </MaskReveal>
            <MaskReveal immediate delay={0.38} className="pl-[0.6em] italic">
              {rest.join(" ")}
            </MaskReveal>
          </h1>
          <Reveal as="p" immediate delay={0.7} className="mt-10 max-w-xl font-serif text-[1.65rem] leading-snug text-ink sm:text-3xl">
            <T>{home.tagline}</T>
          </Reveal>
          <Reveal as="p" immediate delay={0.85} className="mt-6 max-w-lg leading-relaxed text-stone">
            <T>{home.intro}</T>
          </Reveal>
          <Reveal immediate delay={1} className="mt-12 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-10">
            <ArrowLink href="/real-estate">{home.realEstateTitle}</ArrowLink>
            <ArrowLink href="/journalism">{home.journalismTitle}</ArrowLink>
            <ArrowLink href="/literature">{home.literatureTitle}</ArrowLink>
          </Reveal>
        </div>

        <Parallax className="relative md:col-span-5" distance={24}>
          <Reveal
            immediate
            delay={0.6}
            y={0}
            duration={1.8}
            className="absolute -inset-0 translate-x-4 translate-y-4 border border-olive/40 md:translate-x-6 md:translate-y-6"
          />
          <Portrait
            src={home.portrait}
            alt={home.portraitAlt || settings.name}
            priority
            sizes="(min-width: 1344px) 520px, (min-width: 768px) 40vw, 100vw"
            className="relative"
          />
        </Parallax>
      </section>

      {/* Statement */}
      <section className="on-dark bg-ink text-ivory">
        <div className="container-site py-24 md:py-36">
          <p className="mx-auto max-w-5xl text-center font-serif text-[clamp(2rem,4.6vw,4rem)] leading-[1.12] font-normal">
            <Reveal as="span" y={0} className="mb-8 block text-lime">
              <span aria-hidden>—</span>
            </Reveal>
            <Reveal as="span" y={40} duration={1.7} delay={0.15} className="block">
              <T>{home.statement}</T>
            </Reveal>
          </p>
        </div>
      </section>

      {/* Two paths */}
      <section aria-labelledby="paths-heading" className="container-site py-24 md:py-32">
        <h2 id="paths-heading" className="eyebrow">
          Three disciplines
        </h2>
        <Stagger className="mt-12 grid border-t border-ink md:grid-cols-3" stagger={0.18}>
          {paths.map((path, i) => (
            <StaggerItem
              as="article"
              key={path.href}
              className={`group relative flex flex-col justify-between gap-16 border-b border-sand py-12 transition-colors duration-500 hover:bg-paper md:min-h-[26rem] md:p-10 lg:p-12 ${i < paths.length - 1 ? "md:border-r" : ""}`}
            >
              <div>
                <span className="font-serif text-lg text-olive italic">{path.index}</span>
                <h3 className="mt-4 font-serif text-[clamp(2.75rem,4.2vw,4rem)] leading-none">
                  {path.title}
                </h3>
                <p className="mt-6 max-w-md leading-relaxed text-stone">
                  <T>{path.text}</T>
                </p>
              </div>
              <ArrowLink href={path.href} className="after:absolute after:inset-0">
                {path.cta}
              </ArrowLink>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Highlights */}
      {home.highlights.length > 0 && (
        <section aria-label="Highlights" className="border-y border-sand bg-paper">
          <Stagger as="dl" className="container-site grid gap-y-12 py-20 sm:grid-cols-3 md:py-24" stagger={0.16}>
            {home.highlights.map((item, i) => (
              <StaggerItem
                key={i}
                className={`flex flex-col-reverse gap-3 sm:px-8 ${i > 0 ? "sm:border-l sm:border-sand" : "sm:pl-0"}`}
              >
                <dt className="text-[0.7rem] font-semibold tracking-[0.24em] text-stone uppercase">
                  <T>{item.label}</T>
                </dt>
                <dd className="font-serif text-6xl leading-none text-ink md:text-7xl">
                  <CountUp value={item.value} />
                </dd>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Contact CTA */}
      <section className="container-site py-24 md:py-36">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <h2 className="font-serif text-[clamp(3rem,7vw,6rem)] leading-[0.95] md:col-span-8">
            <MaskReveal>Begin with a</MaskReveal>
            <MaskReveal delay={0.15} className="italic">
              conversation.
            </MaskReveal>
          </h2>
          <Reveal delay={0.4} className="md:col-span-4 md:justify-self-end">
            <ArrowLink href="/contact">Get in touch</ArrowLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

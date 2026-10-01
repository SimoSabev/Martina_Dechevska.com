import Markdoc from "@markdoc/markdoc";
import React from "react";
import { ArrowLink } from "@/components/arrow-link";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Portrait } from "@/components/portrait";
import { T } from "@/components/text";
import { getAbout, getSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { personSchema } from "@/lib/structured-data";

export async function generateMetadata() {
  const about = await getAbout();
  return pageMetadata({ title: "About", description: about.lede, path: "/about" });
}

export default async function AboutPage() {
  const [settings, about] = await Promise.all([getSettings(), getAbout()]);

  return (
    <>
      <JsonLd data={personSchema(settings)} />
      <PageHeader eyebrow="About" heading={about.heading} />

      <section className="container-site grid gap-14 pb-24 md:grid-cols-12 md:gap-10 md:pb-32">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="md:sticky md:top-10">
            <Portrait
              src={about.portrait}
              alt={about.portraitAlt || settings.name}
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <p className="font-serif text-[1.75rem] leading-snug text-ink sm:text-[2rem]">
            <T>{about.lede}</T>
          </p>
          <div className="prose-bio mt-12 border-t border-sand pt-12">
            {Markdoc.renderers.react(about.body, React)}
          </div>
          <div className="mt-16 flex flex-col gap-6 border-t border-sand pt-10 sm:flex-row sm:gap-12">
            <ArrowLink href="/journalism">Journalism</ArrowLink>
            <ArrowLink href="/real-estate">Real Estate</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}

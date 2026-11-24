import Markdoc from "@markdoc/markdoc";
import Image from "next/image";
import React from "react";
import { ArrowLink } from "@/components/arrow-link";
import { JsonLd } from "@/components/json-ld";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion";
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
  const photos = about.gallery.filter((photo) => photo.image);
  const galleryGroups = (["tall", "wide"] as const)
    .map((shape) => ({ shape, photos: photos.filter((photo) => (photo.shape ?? "tall") === shape) }))
    .filter((group) => group.photos.length > 0);

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
          <Reveal as="p" immediate delay={0.5} className="font-serif text-[1.75rem] leading-snug text-ink sm:text-[2rem]">
            <T>{about.lede}</T>
          </Reveal>
          <Reveal delay={0.2} className="prose-bio mt-12 border-t border-sand pt-12">
            {Markdoc.renderers.react(about.body, React)}
          </Reveal>
          <Reveal className="mt-16 flex flex-col gap-6 border-t border-sand pt-10 sm:flex-row sm:flex-wrap sm:gap-x-10">
            <ArrowLink href="/journalism">Journalism</ArrowLink>
            <ArrowLink href="/literature">Literature</ArrowLink>
            <ArrowLink href="/real-estate">Real Estate</ArrowLink>
          </Reveal>
        </div>
      </section>

      {galleryGroups.length > 0 && (
        <section aria-labelledby="gallery-heading" className="border-t border-sand bg-paper">
          <div className="container-site py-24 md:py-32">
            <h2 id="gallery-heading" className="eyebrow">
              Photos
            </h2>
            {galleryGroups.map(({ shape, photos }) => (
              <Stagger
                key={shape}
                as="ul"
                className={`mt-12 grid gap-10 sm:grid-cols-2 ${shape === "tall" ? "lg:grid-cols-3" : ""}`}
                stagger={0.18}
              >
                {photos.map((photo, i) => (
                  <StaggerItem as="li" key={photo.image}>
                    <figure>
                      <div
                        className={`relative overflow-hidden bg-ink ${shape === "tall" ? "aspect-[2/3]" : "aspect-[3/2]"}`}
                      >
                        <ImageReveal delay={i * 0.15}>
                          <Image
                            src={photo.image!}
                            alt={photo.alt || settings.name}
                            fill
                            sizes={
                              shape === "tall"
                                ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                : "(min-width: 640px) 50vw, 100vw"
                            }
                            className="object-cover"
                          />
                        </ImageReveal>
                      </div>
                      {photo.credit && <figcaption className="mt-3 text-xs text-stone">Photo: {photo.credit}</figcaption>}
                    </figure>
                  </StaggerItem>
                ))}
              </Stagger>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

import Markdoc from "@markdoc/markdoc";
import Image from "next/image";
import React from "react";
import { ArrowLink } from "@/components/arrow-link";
import { ImageReveal, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHeader } from "@/components/page-header";
import { T } from "@/components/text";
import { YouTubeVideo } from "@/components/youtube-video";
import { getLiterature } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { youtubeId } from "@/lib/youtube";

export async function generateMetadata() {
  const page = await getLiterature();
  return pageMetadata({ title: "Literature", description: page.lede, path: "/literature" });
}

export default async function LiteraturePage() {
  const page = await getLiterature();
  const videos = page.videos.filter((v) => youtubeId(v.url));

  return (
    <>
      <PageHeader index="02" eyebrow="Literature" heading={page.heading} intro={page.lede} />

      <section className="container-site grid gap-16 pb-24 md:grid-cols-12 md:gap-10 md:pb-32">
        {page.books.length > 0 && (
          <div className="md:col-span-5 lg:col-span-4">
            <h2 className="eyebrow">Books</h2>
            <Stagger as="ul" className="mt-10 space-y-12" stagger={0.2}>
              {page.books.map((book) => (
                <StaggerItem as="li" key={book.title}>
                  <div className="relative aspect-[2/3] max-w-xs overflow-hidden bg-ink">
                    {book.cover ? (
                      <ImageReveal>
                        <Image
                          src={book.cover}
                          alt={`Cover of ${book.title}`}
                          fill
                          sizes="(min-width: 768px) 320px, 80vw"
                          className="object-cover"
                        />
                      </ImageReveal>
                    ) : (
                      <div className="on-dark absolute inset-0 flex flex-col justify-between bg-[radial-gradient(120%_80%_at_70%_10%,#2a2a25_0%,#141412_60%)] p-8">
                        <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-mist uppercase">
                          Martina Dechevska
                        </span>
                        <span className="font-serif text-5xl leading-none text-ivory">{book.title}</span>
                        <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-lime uppercase">
                          {book.year}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-ink pt-4">
                    <h3 className="font-serif text-3xl">{book.title}</h3>
                    <span className="text-[0.7rem] font-semibold tracking-[0.22em] text-stone uppercase">
                      {book.year}
                    </span>
                  </div>
                  {book.note && (
                    <p className="mt-3 leading-relaxed text-stone">
                      <T>{book.note}</T>
                    </p>
                  )}
                  {book.url && (
                    <ArrowLink href={book.url} className="mt-6" target="_blank" rel="noopener noreferrer">
                      Get the book
                      <span className="sr-only"> (opens in a new tab)</span>
                    </ArrowLink>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}

        <div className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.3} className="prose-bio">
            {Markdoc.renderers.react(page.body, React)}
          </Reveal>
        </div>
      </section>

      {videos.length > 0 && (
        <section aria-labelledby="literature-videos" className="border-t border-sand bg-paper">
          <div className="container-site py-24 md:py-32">
            <h2 id="literature-videos" className="eyebrow">
              On video
            </h2>
            <Stagger as="ul" className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
              {videos.map((video) => (
                <StaggerItem as="li" key={video.url}>
                  <YouTubeVideo url={video.url} title={video.title} sizes="(min-width: 768px) 50vw, 100vw" />
                  <h3 className="mt-6 font-serif text-[1.6rem] leading-[1.15]">
                    <T>{video.title}</T>
                  </h3>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}

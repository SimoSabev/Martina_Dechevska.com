import { ArrowLink } from "@/components/arrow-link";
import { ArticleCard } from "@/components/article-card";
import { MaskReveal, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHeader } from "@/components/page-header";
import { T } from "@/components/text";
import { VideoCard } from "@/components/video-card";
import { getArticles, getJournalism, getSettings, getVideos } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const page = await getJournalism();
  return pageMetadata({ title: "Journalism", description: page.intro, path: "/journalism" });
}

export default async function JournalismPage() {
  const [settings, page, articles, videos] = await Promise.all([
    getSettings(),
    getJournalism(),
    getArticles(),
    getVideos(),
  ]);
  const archiveHost = settings.archiveUrl ? new URL(settings.archiveUrl).host.replace(/^www\./, "") : null;

  return (
    <>
      <PageHeader index="01" eyebrow="Journalism" heading={page.heading} intro={page.intro} />

      <section aria-labelledby="articles-heading" className="container-site pb-24 md:pb-32">
        <h2 id="articles-heading" className="sr-only">
          Selected articles
        </h2>
        {articles.length > 0 ? (
          <Stagger as="ul" className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {articles.map((article) => (
              <StaggerItem as="li" key={article.slug}>
                <ArticleCard article={article} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="border-t border-ink pt-8 text-stone">Selected articles will appear here.</p>
        )}
      </section>

      {videos.length > 0 && (
        <section aria-labelledby="videos-heading" className="bg-paper">
          <div className="container-site py-24 md:py-32">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-8">
                <Reveal as="p" className="eyebrow" y={12}>
                  Video
                </Reveal>
                <h2
                  id="videos-heading"
                  className="mt-8 font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.01em]"
                >
                  <MaskReveal delay={0.1}>
                    <T>{page.videosTitle}</T>
                  </MaskReveal>
                </h2>
              </div>
              {page.videosIntro && (
                <Reveal as="p" delay={0.3} className="self-end leading-relaxed text-stone md:col-span-4">
                  <T>{page.videosIntro}</T>
                </Reveal>
              )}
            </div>
            <Stagger as="ul" className="mt-16 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
              {videos.map((video, i) => (
                <StaggerItem as="li" key={video.slug} className={i === 0 ? "md:col-span-2" : undefined}>
                  <VideoCard video={video} large={i === 0} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {settings.archiveUrl && (
        <section aria-labelledby="archive-heading" className="on-dark bg-ink text-ivory">
          <div className="container-site grid gap-12 py-24 md:grid-cols-12 md:py-32">
            <div className="md:col-span-7">
              <Reveal as="p" className="eyebrow" y={12}>
                The archive · {page.archiveYears}
              </Reveal>
              <h2
                id="archive-heading"
                className="mt-8 font-serif text-[clamp(3.25rem,8vw,7rem)] leading-[0.92] font-medium italic"
              >
                <MaskReveal delay={0.1}>{page.archiveTitle}</MaskReveal>
              </h2>
            </div>
            <Reveal delay={0.3} className="flex flex-col justify-end gap-10 md:col-span-5">
              <p className="text-lg leading-relaxed text-ivory/80">{page.archiveText}</p>
              <ArrowLink href={settings.archiveUrl} tone="dark" target="_blank" rel="noopener noreferrer">
                Visit {archiveHost}
                <span className="sr-only"> (opens in a new tab)</span>
              </ArrowLink>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}

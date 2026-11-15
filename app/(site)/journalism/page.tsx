import { ArrowLink } from "@/components/arrow-link";
import { ArticleCard } from "@/components/article-card";
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
          <ul className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-ink pt-8 text-stone">Selected articles will appear here.</p>
        )}
      </section>

      {videos.length > 0 && (
        <section aria-labelledby="videos-heading" className="bg-paper">
          <div className="container-site py-24 md:py-32">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-8">
                <p className="eyebrow">Video</p>
                <h2
                  id="videos-heading"
                  className="mt-8 font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.01em]"
                >
                  <T>{page.videosTitle}</T>
                </h2>
              </div>
              {page.videosIntro && (
                <p className="self-end leading-relaxed text-stone md:col-span-4">
                  <T>{page.videosIntro}</T>
                </p>
              )}
            </div>
            <ul className="mt-16 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, i) => (
                <li key={video.slug} className={i === 0 ? "md:col-span-2" : undefined}>
                  <VideoCard video={video} large={i === 0} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {settings.archiveUrl && (
        <section aria-labelledby="archive-heading" className="on-dark bg-ink text-ivory">
          <div className="container-site grid gap-12 py-24 md:grid-cols-12 md:py-32">
            <div className="md:col-span-7">
              <p className="eyebrow">The archive · {page.archiveYears}</p>
              <h2
                id="archive-heading"
                className="mt-8 font-serif text-[clamp(3.25rem,8vw,7rem)] leading-[0.92] font-medium italic"
              >
                {page.archiveTitle}
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-10 md:col-span-5">
              <p className="text-lg leading-relaxed text-ivory/80">{page.archiveText}</p>
              <ArrowLink href={settings.archiveUrl} tone="dark" target="_blank" rel="noopener noreferrer">
                Visit {archiveHost}
                <span className="sr-only"> (opens in a new tab)</span>
              </ArrowLink>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

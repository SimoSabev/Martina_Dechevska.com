import Image from "next/image";
import type { Video } from "@/lib/content";
import { youtubeId, youtubeThumbnail } from "@/lib/youtube";
import { Arrow } from "./arrow-link";
import { T } from "./text";
import { VideoPlayer } from "./video-player";

type Props = { video: Video; large?: boolean };

export function VideoCard({ video, large = false }: Props) {
  const sizes = large ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";
  const meta = [video.outlet, video.when, video.language].filter(Boolean) as string[];
  const ytId = youtubeId(video.youtubeUrl);
  const source = video.video
    ? ({ kind: "file", src: video.video } as const)
    : ytId
      ? ({ kind: "youtube", id: ytId } as const)
      : null;

  return (
    <article className="flex h-full flex-col border-t border-ink pt-8 pb-10">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.7rem] font-semibold tracking-[0.22em] text-stone uppercase">
        {meta.map((item, i) => (
          <span key={item} className={i === 0 ? "text-ink" : undefined}>
            <T>{item}</T>
          </span>
        ))}
      </div>

      <div className="mt-6">
        {source ? (
          <VideoPlayer
            source={source}
            poster={video.poster || (ytId ? youtubeThumbnail(ytId) : null)}
            title={video.title}
            duration={video.duration}
            sizes={sizes}
          />
        ) : (
          <a
            href={video.externalUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-video overflow-hidden bg-ink"
          >
            {video.poster && (
              <Image
                src={video.poster}
                alt=""
                fill
                sizes={sizes}
                className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
              />
            )}
            <span className="absolute bottom-4 left-4 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.22em] text-ivory uppercase">
              Watch
              <Arrow className="h-3 w-7" />
            </span>
            <span className="sr-only">
              {video.title} (opens in a new tab)
            </span>
          </a>
        )}
      </div>

      <h3 className={`mt-6 font-serif leading-[1.15] text-ink ${large ? "text-[clamp(1.85rem,3vw,2.5rem)]" : "text-[1.6rem]"}`}>
        <T>{video.title}</T>
      </h3>
      {video.summary && (
        <p className="mt-3 leading-relaxed text-stone">
          <T>{video.summary}</T>
        </p>
      )}
      {video.credit && <p className="mt-auto pt-6 text-xs text-stone">{video.credit}</p>}
    </article>
  );
}

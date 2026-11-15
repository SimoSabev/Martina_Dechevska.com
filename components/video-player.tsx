"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster: string | null | undefined;
  title: string;
  duration?: string | null;
  sizes: string;
};

/**
 * Click-to-play facade. Until the visitor presses play, the page only loads an
 * optimised poster image — no video bytes — so a grid of reports costs about
 * as much as a grid of photos.
 */
export function VideoPlayer({ src, poster, title, duration, sizes }: Props) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!playing) return;
    const video = videoRef.current;
    video?.focus();
    // Autoplay can be refused (e.g. data saver); native controls stay usable.
    video?.play().catch(() => {});
  }, [playing]);

  return (
    <div className="relative aspect-video overflow-hidden bg-ink">
      {playing ? (
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          preload="auto"
          aria-label={title}
          className="absolute inset-0 h-full w-full bg-ink object-contain"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 block h-full w-full cursor-pointer text-left"
        >
          <span className="sr-only">Play video: {title}</span>
          {poster && (
            <Image
              src={poster}
              alt=""
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
            />
          )}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <span
            aria-hidden
            className="absolute bottom-4 left-4 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.22em] text-ivory uppercase"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/70 bg-ink/40 backdrop-blur-sm transition-colors duration-500 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
              <svg viewBox="0 0 12 14" className="ml-0.5 h-3.5 w-3" fill="currentColor">
                <path d="M0 0v14l12-7z" />
              </svg>
            </span>
            {duration ? `Play · ${duration}` : "Play"}
          </span>
        </button>
      )}
    </div>
  );
}

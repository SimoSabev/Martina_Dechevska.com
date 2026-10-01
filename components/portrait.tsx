import Image from "next/image";

type Props = {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
};

/**
 * Portrait in a 4:5 frame. Until a photo is uploaded in Keystatic, renders an
 * intentional monogram panel instead of a broken or stock image.
 */
export function Portrait({ src, alt, priority, sizes, className = "" }: Props) {
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-ink ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label="Portrait coming soon"
          className="on-dark absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[radial-gradient(120%_80%_at_70%_10%,#2a2a25_0%,#141412_60%)]"
        >
          <span className="font-serif text-[clamp(5rem,12vw,9rem)] leading-none tracking-[-0.02em] text-ivory/90">
            M<span className="text-lime">·</span>D
          </span>
          <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-mist uppercase">
            [Professional photo]
          </span>
        </div>
      )}
    </div>
  );
}

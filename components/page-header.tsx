import { T } from "./text";

type Props = { eyebrow: string; heading: string; intro?: string | null; index?: string };

export function PageHeader({ eyebrow, heading, intro, index }: Props) {
  return (
    <header className="container-site grid gap-10 pt-16 pb-16 md:grid-cols-12 md:pt-24 md:pb-24">
      <div className="md:col-span-8">
        <p className="eyebrow">
          {index && <span className="font-serif text-sm tracking-normal text-olive normal-case italic">{index}</span>}
          {eyebrow}
        </p>
        <h1 className="mt-8 font-serif text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.015em]">
          <T>{heading}</T>
        </h1>
      </div>
      {intro && (
        <p className="self-end leading-relaxed text-stone md:col-span-4">
          <T>{intro}</T>
        </p>
      )}
    </header>
  );
}

import type { Article } from "@/lib/content";
import { Arrow } from "./arrow-link";
import { T } from "./text";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

export function ArticleCard({ article }: { article: Article }) {
  const date = article.date ? new Date(article.date) : null;
  const body = (
    <>
      <div className="flex items-baseline justify-between gap-6 text-[0.7rem] font-semibold tracking-[0.22em] text-stone uppercase">
        <span>
          <T>{article.outlet}</T>
        </span>
        {date ? <time dateTime={article.date!}>{dateFormat.format(date)}</time> : <span className="is-placeholder">[Date]</span>}
      </div>
      <h3 className="mt-6 font-serif text-[1.85rem] leading-[1.15] text-ink">
        <T>{article.title}</T>
      </h3>
      {article.excerpt && (
        <p className="mt-4 leading-relaxed text-stone">
          <T>{article.excerpt}</T>
        </p>
      )}
      <span className="mt-auto flex items-center gap-3 pt-10 text-[0.7rem] font-semibold tracking-[0.22em] text-ink uppercase">
        {article.url ? "Read article" : <span className="is-placeholder">[Link to article]</span>}
        <Arrow className="h-3 w-7 transition-transform duration-500 ease-out-soft group-hover:translate-x-1.5" />
      </span>
    </>
  );

  const className =
    "group flex h-full flex-col border-t border-ink bg-ivory pt-8 pb-10 transition-colors duration-500 md:px-8 md:hover:bg-paper";

  return article.url ? (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

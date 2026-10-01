import { isPlaceholder } from "@/lib/placeholder";

/** Prints CMS text, flagging `[placeholder]` values so they are easy to spot. */
export function T({ children }: { children: string | null | undefined }) {
  if (!children) return null;
  if (!isPlaceholder(children)) return <>{children}</>;
  return <span className="is-placeholder">{children}</span>;
}

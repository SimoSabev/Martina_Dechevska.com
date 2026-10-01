import type { Metadata } from "next";
import { filled } from "./placeholder";

/** Per-page metadata; placeholder descriptions fall back to the site default. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description?: string | null;
  path: string;
}): Metadata {
  const desc = filled(description);
  return {
    title,
    ...(desc && { description: desc }),
    alternates: { canonical: path },
    openGraph: { title, url: path, ...(desc && { description: desc }) },
  };
}

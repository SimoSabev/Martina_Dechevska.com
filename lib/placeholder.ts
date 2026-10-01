/**
 * Content that has not been supplied yet is written as `[Something]`.
 * These helpers keep placeholders visible on the page but out of links,
 * structured data and search metadata.
 */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return /\[[^\]]+\]/.test(value);
}

export function filled(value: string | null | undefined): string | undefined {
  return isPlaceholder(value) ? undefined : value!.trim();
}

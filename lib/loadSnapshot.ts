import "server-only";
import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import path from "path";
import { getEntry, type SnapshotEntry } from "./snapshotRegistry";

/**
 * Server-side snapshot loader used by per-page route files
 * (app/page.tsx, app/about-us/page.tsx, app/he/page.tsx, …).
 *
 * Each generated page calls `loadSnapshot(slug, locale)` directly — no dynamic
 * params, no segment parsing. Returns the registry entry plus the page body
 * HTML fragment read from `public/<entry.fragment>`.
 *
 * Triggers notFound() if the slug is not in the registry or the fragment file
 * is missing on disk, so build failures surface as 404s rather than crashes.
 */
export type LoadedSnapshot = {
  entry: SnapshotEntry;
  bodyHtml: string;
  widgetProps: Record<string, { type: string; props: unknown }> | null;
};

export async function loadSnapshot(
  slug: string,
  locale: string,
): Promise<LoadedSnapshot> {
  const entry = getEntry(slug, locale);
  if (!entry) notFound();

  try {
    const fragmentPath = path.join(process.cwd(), "public", entry.fragment);
    const bodyHtml = await readFile(fragmentPath, "utf-8");

    const widgetProps = await readWidgetProps(slug, locale);

    return { entry, bodyHtml, widgetProps };
  } catch {
    notFound();
  }
}

async function readWidgetProps(
  slug: string,
  locale: string,
): Promise<Record<string, { type: string; props: unknown }> | null> {
  const propsPath = path.join(
    process.cwd(),
    "lib",
    "widgetProps",
    `${slug}-${locale}.json`,
  );
  try {
    const raw = await readFile(propsPath, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, { type: string; props: unknown }>;
  } catch {
    return null;
  }
}

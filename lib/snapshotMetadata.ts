import type { Metadata } from "next";
import { getEntry, type SnapshotHead } from "./snapshotRegistry";

/**
 * Build a Next.js Metadata object from a registry entry's captured <head>.
 *
 * Extracted from the old dynamic `[[...slug]]/page.tsx` so every per-page
 * route (app/page.tsx, app/about-us/page.tsx, …) can call it directly:
 *
 *   export const generateMetadata = () => snapshotMetadata("about-us", "en");
 *
 * Returns an empty object if the entry is missing — Next.js then falls back to
 * layout-level metadata, which is the correct behaviour for 404s.
 */
export function snapshotMetadata(slug: string, locale: string): Metadata {
  const entry = getEntry(slug, locale);
  if (!entry?.head) return {};

  const head: SnapshotHead = entry.head;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const ogImages = head.ogImage ? [{ url: head.ogImage }] : [];

  const ogTitle =
    head.metaTags.find((t) => t.property === "og:title")?.content ?? head.title;
  const ogDescription =
    head.metaTags.find((t) => t.property === "og:description")?.content ??
    head.metaTags.find((t) => t.name === "description")?.content ??
    "";
  const twitterTitle =
    head.metaTags.find((t) => t.name === "twitter:title")?.content ?? ogTitle;
  const twitterDescription =
    head.metaTags.find((t) => t.name === "twitter:description")?.content ??
    ogDescription;
  const twitterImage =
    head.metaTags.find((t) => t.name === "twitter:image")?.content ?? head.ogImage;

  const canonical =
    head.linkTags.find((l) => l.rel === "canonical")?.href ??
    (siteUrl ? `${siteUrl}/${slug === "home" ? "" : slug}` : undefined);

  const alternates: Record<string, string> = {};
  for (const link of head.linkTags) {
    if (link.rel === "alternate" && link.hreflang && link.href) {
      alternates[link.hreflang] = link.href;
    }
  }

  const robotsMeta = head.metaTags.find((t) => t.name === "robots")?.content;

  return {
    title: head.title,
    description: head.metaTags.find((t) => t.name === "description")?.content,
    ...(robotsMeta ? { robots: robotsMeta } : {}),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImages,
      locale,
      type: "website",
    },
    twitter: {
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
    alternates: {
      canonical,
      ...(Object.keys(alternates).length ? { languages: alternates } : {}),
    },
  };
}

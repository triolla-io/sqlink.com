import type { MetadataRoute } from "next";
import { getAllSlugs, getEntry, getDefaultLocale } from "../lib/snapshotRegistry";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const defaultLocale = getDefaultLocale();
  const slugs = getAllSlugs();

  return slugs.map(({ slug, locale }) => {
    const path =
      locale === defaultLocale
        ? `/${slug === "home" ? "" : slug}`
        : `/${locale}/${slug === "home" ? "" : slug}`;

    const entry = getEntry(slug, locale);
    const lastmod = entry?.head?.metaTags.find(
      (t) => t.name === "article:modified_time" || t.property === "article:modified_time"
    )?.content;

    return {
      url: `${siteUrl}${path}`,
      lastModified: lastmod ? new Date(lastmod) : new Date(),
      changeFrequency: "weekly" as const,
      priority: slug === "home" ? 1.0 : 0.8,
    };
  });
}

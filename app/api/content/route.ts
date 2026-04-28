import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getEntry, getDefaultLocale } from "../../../lib/snapshotRegistry";

/**
 * Content API — returns structured page data for LLM consumption.
 *
 * GET /api/content?url=/about-us
 * GET /api/content?url=/he/services
 *
 * Response:
 * {
 *   "url": "/about-us",
 *   "slug": "about-us",
 *   "language": "en",
 *   "title": "About Us",
 *   "description": "...",
 *   "markdown": "# About Us\n\n...",
 *   "jsonLd": [...],
 *   "ogImage": "https://..."
 * }
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const urlParam = searchParams.get("url") ?? "/";

  // Parse locale + slug from path
  const segments = urlParam.replace(/^\//, "").split("/").filter(Boolean);
  const defaultLocale = getDefaultLocale();

  let locale = defaultLocale;
  let slugSegments = segments;

  if (segments.length >= 1) {
    const candidate = segments[0];
    if (candidate.length === 2 || candidate.length === 3) {
      locale = candidate;
      slugSegments = segments.slice(1);
    }
  }

  const slug = slugSegments.length === 0 ? "home" : slugSegments.join("-");
  const entry = getEntry(slug, locale);

  if (!entry) {
    return NextResponse.json({ error: "Page not found", url: urlParam }, { status: 404 });
  }

  const head = entry.head;
  const title = head?.title ?? slug;
  const description =
    head?.metaTags.find((t) => t.name === "description")?.content ??
    head?.metaTags.find((t) => t.property === "og:description")?.content ??
    "";
  const ogImage = head?.ogImage ?? "";

  // Read markdown mirror
  let markdown = "";
  const mdFilename =
    locale === defaultLocale ? `${slug}.md` : `${locale}/${slug}.md`;
  try {
    const mdPath = path.join(process.cwd(), "public", mdFilename);
    markdown = await readFile(mdPath, "utf-8");
  } catch {
    // Markdown mirror not available — return empty string, not an error
  }

  const jsonLd = [
    ...(head?.jsonLd ?? []),
    ...(head?.jsonLdSynthesized ?? []),
  ].map((block) => {
    try {
      return JSON.parse(block);
    } catch {
      return null;
    }
  }).filter(Boolean);

  const responseData = {
    url: urlParam,
    slug,
    language: locale,
    title,
    description,
    markdown,
    jsonLd,
    ogImage,
    loadOrderSha: entry.loadOrderSha,
  };

  return NextResponse.json(responseData, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

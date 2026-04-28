import registryData from "./snapshotRegistry.json";

export interface SnapshotHeadMeta {
  name?: string;
  property?: string;
  content?: string;
  charset?: string;
  "http-equiv"?: string;
  [key: string]: string | undefined;
}

export interface SnapshotHeadLink {
  rel?: string;
  href?: string;
  hreflang?: string;
  type?: string;
  sizes?: string;
  [key: string]: string | undefined;
}

export interface SnapshotHead {
  title: string;
  htmlLang: string;
  htmlDir: "ltr" | "rtl";
  metaTags: SnapshotHeadMeta[];
  linkTags: SnapshotHeadLink[];
  jsonLd: string[];
  jsonLdSynthesized?: string[];
  ogImage?: string;
}

export interface SnapshotEntry {
  slug: string;
  locale: string;
  dir: "ltr" | "rtl";
  fragment: string;
  css: string[];
  js: string[];
  inlineScripts: Array<{ position: number; code: string }>;
  loadOrderSha: string;
  gsapHook: boolean;
  loadedDelayMs: number;
  head?: SnapshotHead;
  fontPreloads?: string[];
  imagePreloads?: Array<{
    href: string;
    type?: string;
    imagesrcset?: string;
  }>;
  jsDefer?: string[];
}

const registry: SnapshotEntry[] = registryData as SnapshotEntry[];

/**
 * Compute the common slug prefix shared by all entries (e.g. "triolla-io-").
 * Used as a fallback so URL paths like "about-us" resolve to "triolla-io-about-us".
 */
function _computeDomainPrefix(): string {
  if (registry.length < 2) return "";
  let prefix = registry[0].slug;
  for (const entry of registry) {
    while (prefix && !entry.slug.startsWith(prefix)) {
      prefix = prefix.slice(0, prefix.lastIndexOf("-") === -1 ? 0 : prefix.lastIndexOf("-") + 1);
    }
    if (!prefix) break;
  }
  return prefix.endsWith("-") ? prefix : "";
}

const DOMAIN_PREFIX = _computeDomainPrefix();

export function getEntry(slug: string, locale: string): SnapshotEntry | null {
  // Exact match
  const exact =
    registry.find((e) => e.slug === slug && e.locale === locale) ??
    registry.find((e) => e.slug === slug);
  if (exact) return exact;

  // Fallback: try with domain prefix (e.g. "home" → "triolla-io-home")
  if (DOMAIN_PREFIX) {
    const prefixed = `${DOMAIN_PREFIX}${slug}`;
    return (
      registry.find((e) => e.slug === prefixed && e.locale === locale) ??
      registry.find((e) => e.slug === prefixed) ??
      null
    );
  }

  return null;
}

export function getAllSlugs(): Array<{ slug: string; locale: string }> {
  return registry.map((e) => ({ slug: e.slug, locale: e.locale }));
}

export function getAllLocales(): string[] {
  return [...new Set(registry.map((e) => e.locale))];
}

export function getDefaultLocale(): string {
  const entry = registry.find((e) => e.locale === "en") ?? registry[0];
  return entry?.locale ?? "en";
}

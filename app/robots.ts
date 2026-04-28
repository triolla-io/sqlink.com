import type { MetadataRoute } from "next";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot",
  "YouBot",
];

function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_ORIGIN ??
    `https://${process.env.VERCEL_URL ?? "localhost"}`;
  if (/^https?:\/\//i.test(raw)) {
    return raw.replace(/\/+$/, "");
  }
  return `https://${raw}`.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl();

  const aiRules = AI_CRAWLERS.map((userAgent) => ({
    userAgent,
    allow: "/",
  }));

  return {
    rules: [
      ...aiRules,
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/wp-admin/",
          "/wp-login.php",
          "/xmlrpc.php",
          "/_next/static/",
          "/api/forms/",
        ],
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/sitemap.json`],
  };
}

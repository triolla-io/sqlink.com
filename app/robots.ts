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


export default function robots(): MetadataRoute.Robots {
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
        disallow: ["/wp-admin/", "/wp-login.php", "/xmlrpc.php", "/_next/static/", "/api/forms/"],
      },
    ],
    sitemap: [`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sqlink.com"}/sitemap.xml`],
  };
}

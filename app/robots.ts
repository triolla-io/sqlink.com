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
        disallow: "/",
      },
    ],
  };
}

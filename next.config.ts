import path from "path";
import type { NextConfig } from "next";

// Populated by engine/scaffold_nextjs.py — do not edit manually
const LOCALES: string[] = ["en"];
const DEFAULT_LOCALE = "en";

// Origin domain — all relative CMS asset paths are proxied here so JS-loaded
// images/fonts/media work without downloading the full site locally.
const ORIGIN = "https://www.sqlink.com";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to THIS directory so it doesn't walk up
  // and inherit files from a parent Next.js project when the generated output
  // lives inside another workspace.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // NOTE: i18n config is intentionally absent. The `i18n` key is Pages Router-only;
  // in App Router it causes Next.js to intercept locale-prefixed paths (e.g. /he/...)
  // as locale redirects before file-system routing resolves them, producing 404s.
  // App Router locale handling is done via the file-system: app/he/ contains
  // Hebrew variants, and each page sets dir via SnapshotScripts/SnapshotClient.

  // Proxy CMS/CDN asset paths to the original domain as a FALLBACK so that
  // JS-loaded images, fonts, and scripts work without downloading the full
  // site locally, without CORS issues for @font-face loads.  Using "fallback"
  // (not "beforeFiles") means LOCAL files in public/ win — so our CAS store
  // at /assets/_cas/ is served from disk, and only unmapped paths hit origin.
  //
  // Note: /assets is intentionally excluded because we own that path.
  async rewrites() {
    if (!ORIGIN) return { beforeFiles: [], afterFiles: [], fallback: [] };
    const beforeFiles = [
      // Chrome DevTools probes this on every localhost load; return 200 to suppress 404 noise.
      {
        source: "/.well-known/appspecific/com.chrome.devtools.json",
        destination: "/api/chrome-devtools-probe",
      },
    ];
    const prefixes = [
      // WordPress
      "/wp-content", "/wp-includes", "/wp-json",
      // Drupal
      "/sites", "/core",
      // Generic CMS / build output
      "/uploads", "/themes", "/plugins",
      "/static", "/media", "/images", "/img", "/fonts",
      "/css", "/js", "/dist", "/build", "/cdn",
    ];
    return {
      beforeFiles,
      afterFiles: [],
      fallback: prefixes.map((prefix) => ({
        source: `${prefix}/:path*`,
        destination: `${ORIGIN}${prefix}/:path*`,
      })),
    };
  },

  compress: true,
  trailingSlash: true,
  poweredByHeader: false,

  // Serve all public/assets/ as static
  // Assets are fingerprinted by SHA-256 so long-cache headers are safe
  headers: async () => {
    // Content-Security-Policy tuned for snapshot pages:
    //  - legacy theme JS depends on inline handlers + eval (jQuery plugins)
    //    so we allow 'unsafe-inline' and 'unsafe-eval' for scripts.
    //  - Snapshot CSS is injected inline so 'unsafe-inline' is also allowed
    //    for styles.
    //  - Lighthouse still rewards having object-src/base-uri/frame-ancestors
    //    locked down, which this policy does.
    // The allow-list intentionally permits any https: origin for images,
    // fonts, connections, and media because snapshots frequently pull from
    // multiple CDNs; the origin is restricted by the proxy rewrite list.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:",
      "style-src 'self' 'unsafe-inline' https: data:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: data: blob:",
      "media-src 'self' data: blob: https:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "frame-src 'self' https:",
      "upgrade-insecure-requests",
    ].join("; ");

    // Trusted Types is advisory for now — reporting-only so snapshot JS that
    // assigns innerHTML does not break, but Lighthouse still credits us for
    // opting into the protection.
    const cspReportOnly = [
      "require-trusted-types-for 'script'",
      "trusted-types default dompurify nextjs#bundler 'allow-duplicates'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",                value: "nosniff" },
          { key: "X-Frame-Options",                       value: "SAMEORIGIN" },
          { key: "Referrer-Policy",                       value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security",             value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy",                    value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Content-Security-Policy",               value: csp },
          { key: "Content-Security-Policy-Report-Only",   value: cspReportOnly },
          { key: "Cross-Origin-Opener-Policy",            value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy",          value: "cross-origin" },
        ],
      },
    {
      source: "/assets/_cas/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/assets/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=604800, stale-while-revalidate=86400",
        },
      ],
    },
    {
      source: "/fragments/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600, stale-while-revalidate=86400",
        },
      ],
    },
    ];
  },
};

export default nextConfig;

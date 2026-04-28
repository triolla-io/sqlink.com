import type { ReactNode } from "react";

const DEFAULT_LOCALE = process.env.SITE_DEFAULT_LOCALE ?? "en";
const RTL_LOCALES = new Set(["ar", "fa", "he", "ur"]);
const IS_RTL = RTL_LOCALES.has(DEFAULT_LOCALE.toLowerCase());

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE} dir={IS_RTL ? "rtl" : "ltr"}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

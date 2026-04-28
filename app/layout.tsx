import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Heebo } from "next/font/google";

// Heebo is self-hosted via next/font — no render-blocking Google Fonts request.
// The font-family name stays "Heebo" so snapshot CSS picks it up automatically.
const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: true,
});

// sqlink.com is a Hebrew site — declare lang="he" for accessibility and SEO.
// dir stays "ltr" because the site CSS manages direction per-element (direction: rtl
// is scoped to specific components; the body-level comment in the CSS confirms this).
const SITE_LANG = process.env.SITE_HTML_LANG ?? "he";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sqlink.com"),
  title: "SQLINK - משרות הייטק ופתרונות IT",
  description:
    "אסקיולינק SQLINK מציעה ללקוחותיה מערך מקיף של פתרונות מחשוב ופתרונות IT. מספקת שירותי IT, שירותי ייעוץ אבטחת מידע ולוח משרות דרושים בהייטק. בין לקוחותיה חברות תוכנה וגופי ממשל.",
  openGraph: {
    title: "SQLINK - משרות הייטק ופתרונות IT",
    description:
      "אסקיולינק SQLINK מציעה ללקוחותיה מערך מקיף של פתרונות מחשוב ופתרונות IT. מספקת שירותי IT, שירותי ייעוץ אבטחת מידע ולוח משרות דרושים בהייטק.",
    url: "https://www.sqlink.com",
    siteName: "SQLink",
    type: "website",
    images: [{ url: "https://www.sqlink.com/images/OGlogo.png" }],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE_LANG} dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0d2d6e" />
      </head>
      <body className={heebo.className}>{children}</body>
    </html>
  );
}

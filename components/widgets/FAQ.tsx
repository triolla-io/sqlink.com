"use client";

import Script from "next/script";

import Accordion, { type AccordionItem } from "./Accordion";

/**
 * FAQ widget = Accordion + automatic ``FAQPage`` JSON-LD output.
 *
 * The detector emits ``schemaEmitted: true`` so we inject a JSON-LD block
 * alongside the rendered list. If the parent page already has an identical
 * JSON-LD block in its <head>, Google treats that as the canonical source
 * and the duplication is harmless.
 */
export type FAQProps = {
  items?: AccordionItem[];
  ariaLabel?: string;
  schemaEmitted?: boolean;
};

export default function FAQ({
  items,
  ariaLabel = "Frequently asked questions",
  schemaEmitted = true,
}: FAQProps) {
  const safe = Array.isArray(items) ? items : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: safe.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };

  return (
    <>
      <Accordion items={safe} ariaLabel={ariaLabel} />
      {schemaEmitted && safe.length > 0 ? (
        <Script
          id={`faq-jsonld-${safe.length}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
    </>
  );
}

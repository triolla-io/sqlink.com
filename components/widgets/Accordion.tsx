"use client";

import { useId, useState } from "react";

/**
 * Generic accordion widget.
 *
 * Emitted when ``engine/detect_widgets`` finds ``.accordion``, ``<details>``,
 * or data-accordion markup with ≥2 item/panel pairs. Each item is rendered
 * as a native disclosure with keyboard focus support.
 */
export type AccordionItem = {
  question: string;
  answer: string;
};

export type AccordionProps = {
  items?: AccordionItem[];
  ariaLabel?: string;
  allowMultiple?: boolean;
};

export default function Accordion({
  items,
  ariaLabel = "Accordion",
  allowMultiple = false,
}: AccordionProps) {
  const safeItems = Array.isArray(items) ? items.filter(isValidItem) : [];
  const uid = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  if (safeItems.length === 0) {
    return null;
  }

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        if (!allowMultiple) next.clear();
        next.add(i);
      }
      return next;
    });
  };

  return (
    <div
      className="react-widget-accordion"
      role="region"
      aria-label={ariaLabel}
    >
      {safeItems.map((item, i) => {
        const isOpen = open.has(i);
        const panelId = `${uid}-panel-${i}`;
        const headerId = `${uid}-header-${i}`;
        return (
          <div
            key={i}
            className="react-widget-accordion-item"
            data-open={isOpen ? "true" : "false"}
          >
            <h3 style={{ margin: 0 }}>
              <button
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="react-widget-accordion-trigger"
                style={{
                  width: "100%",
                  textAlign: "start",
                  padding: "0.75rem 1rem",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  font: "inherit",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 200ms ease",
                    fontSize: "1.25rem",
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className="react-widget-accordion-panel"
              style={{ padding: isOpen ? "0 1rem 0.75rem" : 0 }}
            >
              <p style={{ margin: 0 }}>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function isValidItem(x: unknown): x is AccordionItem {
  if (!x || typeof x !== "object") return false;
  const obj = x as Record<string, unknown>;
  return typeof obj.question === "string" && typeof obj.answer === "string";
}

"use client";

import { useId } from "react";

/**
 * Ticker / marquee widget.
 *
 * CSS-keyframe-driven horizontal scroll — items loop seamlessly by rendering
 * the list twice back-to-back. No JS animation loop, no RAF, no timers.
 * Pauses on hover/focus for accessibility (prefers-reduced-motion disables
 * the animation entirely).
 */
export type TickerItem = {
  image?: string | null;
  alt?: string | null;
  text?: string | null;
  href?: string | null;
};

export type TickerProps = {
  items?: TickerItem[];
  speedSeconds?: number;
  ariaLabel?: string;
  direction?: "left" | "right";
};

export default function Ticker({
  items,
  speedSeconds = 40,
  ariaLabel = "Marquee",
  direction = "left",
}: TickerProps) {
  const safe = Array.isArray(items) ? items.filter(Boolean) : [];
  const uid = useId().replace(/[:]/g, "");
  const animationName = `ticker-${uid}`;
  const duration = Math.max(5, Number(speedSeconds) || 40);

  if (safe.length === 0) return null;

  return (
    <div
      className="react-widget-ticker"
      role="marquee"
      aria-label={ariaLabel}
      style={{
        overflow: "hidden",
        width: "100%",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes ${animationName} {
          from { transform: translateX(0); }
          to   { transform: translateX(${direction === "right" ? "50%" : "-50%"}); }
        }
        .react-widget-ticker-track-${uid} {
          display: flex;
          width: max-content;
          gap: 2rem;
          animation: ${animationName} ${duration}s linear infinite;
          animation-play-state: running;
        }
        .react-widget-ticker:hover .react-widget-ticker-track-${uid},
        .react-widget-ticker:focus-within .react-widget-ticker-track-${uid} {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .react-widget-ticker-track-${uid} { animation: none; }
        }
      `}</style>
      <div
        className={`react-widget-ticker-track-${uid}`}
        aria-hidden="false"
      >
        {/* Render items twice for a seamless infinite loop */}
        {[0, 1].map((pass) => (
          <div
            key={pass}
            style={{ display: "flex", gap: "2rem", flex: "0 0 auto" }}
            aria-hidden={pass === 1 ? "true" : "false"}
          >
            {safe.map((item, i) => (
              <TickerItemView key={`${pass}-${i}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TickerItemView({ item }: { item: TickerItem }) {
  const body = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        flex: "0 0 auto",
      }}
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.alt ?? ""}
          loading="lazy"
          style={{ height: "2rem", width: "auto", display: "block" }}
        />
      ) : null}
      {item.text ? <span>{item.text}</span> : null}
    </span>
  );

  if (item.href) {
    return (
      <a href={item.href} style={{ color: "inherit", textDecoration: "none" }}>
        {body}
      </a>
    );
  }
  return body;
}

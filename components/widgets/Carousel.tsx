"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic carousel widget.
 *
 * Emitted by ``engine/detect_widgets`` when a Swiper / Owl / Slick / Glide /
 * Splide / Flickity / Keen / custom ``[data-carousel]`` container is found.
 * Fully self-contained — no external JS dependency. Uses CSS transform to
 * slide the track and native pointer events for drag-to-swipe.
 *
 * Props are the JSON payload written to ``lib/widgetProps/<slug>.json`` —
 * never trust shapes, validate at render time.
 */
export type CarouselSlide = {
  image?: string | null;
  alt?: string | null;
  heading?: string | null;
  text?: string | null;
  href?: string | null;
};

export type CarouselProps = {
  slides?: CarouselSlide[];
  autoplay?: boolean;
  loop?: boolean;
  ariaLabel?: string;
  showControls?: boolean;
  intervalMs?: number;
};

const DEFAULT_INTERVAL_MS = 5000;
const DRAG_THRESHOLD_PX = 40;

export default function Carousel({
  slides,
  autoplay = false,
  loop = true,
  ariaLabel = "Carousel",
  showControls = true,
  intervalMs = DEFAULT_INTERVAL_MS,
}: CarouselProps) {
  const safeSlides = Array.isArray(slides) ? slides.filter(Boolean) : [];
  const total = safeSlides.length;
  const [index, setIndex] = useState(0);
  const dragStart = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      if (loop) {
        setIndex(((next % total) + total) % total);
      } else {
        setIndex(Math.max(0, Math.min(total - 1, next)));
      }
    },
    [loop, total],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!autoplay || total < 2) return;
    intervalRef.current = setInterval(next, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoplay, intervalMs, next, total]);

  if (total === 0) {
    return (
      <div role="status" aria-label={ariaLabel} className="carousel-empty">
        No items.
      </div>
    );
  }

  return (
    <div
      className="react-widget-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        dragStart.current = e.clientX;
        dragDelta.current = 0;
      }}
      onPointerMove={(e) => {
        if (dragStart.current == null) return;
        dragDelta.current = e.clientX - dragStart.current;
      }}
      onPointerUp={() => {
        const dx = dragDelta.current;
        dragStart.current = null;
        dragDelta.current = 0;
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        if (dx < 0) next();
        else prev();
      }}
      onPointerCancel={() => {
        dragStart.current = null;
        dragDelta.current = 0;
      }}
      style={{ position: "relative", overflow: "hidden", touchAction: "pan-y" }}
    >
      <div
        className="react-widget-carousel-track"
        style={{
          display: "flex",
          transform: `translateX(-${index * 100}%)`,
          transition: "transform 400ms ease",
        }}
      >
        {safeSlides.map((slide, i) => (
          <CarouselSlideView key={i} slide={slide} active={i === index} />
        ))}
      </div>

      {showControls && total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="react-widget-carousel-prev"
            style={buttonStyle({ left: 8 })}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="react-widget-carousel-next"
            style={buttonStyle({ right: 8 })}
          >
            ›
          </button>
          <div
            className="react-widget-carousel-dots"
            role="tablist"
            style={{
              position: "absolute",
              bottom: 12,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {safeSlides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  border: "none",
                  background:
                    i === index ? "#000" : "rgba(0,0,0,0.3)",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CarouselSlideView({
  slide,
  active,
}: {
  slide: CarouselSlide;
  active: boolean;
}) {
  const content = (
    <div
      style={{
        flex: "0 0 100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {slide.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.image}
          alt={slide.alt ?? slide.heading ?? ""}
          style={{ display: "block", width: "100%", height: "auto" }}
          loading={active ? "eager" : "lazy"}
        />
      ) : null}
      {(slide.heading || slide.text) && (
        <div style={{ padding: "0.75rem 0" }}>
          {slide.heading ? (
            <h3 style={{ margin: "0 0 0.25rem 0" }}>{slide.heading}</h3>
          ) : null}
          {slide.text ? (
            <p style={{ margin: 0 }}>{slide.text}</p>
          ) : null}
        </div>
      )}
    </div>
  );
  if (slide.href) {
    return (
      <a
        href={slide.href}
        style={{ display: "block", flex: "0 0 100%", color: "inherit" }}
      >
        {content}
      </a>
    );
  }
  return content;
}

function buttonStyle(extra: { left?: number; right?: number }): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 36,
    height: 36,
    border: "none",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
    cursor: "pointer",
    fontSize: 20,
    lineHeight: 1,
    zIndex: 2,
    ...extra,
  };
}

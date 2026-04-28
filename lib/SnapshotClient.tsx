"use client";

import { useEffect, useRef } from "react";
import type { SnapshotEntry } from "./snapshotRegistry";
import { mountWidgets, unmountWidgets } from "./widgets";

interface Props {
  entry: SnapshotEntry;
  bodyHtml: string;
  widgetProps?: Record<string, { type: string; props: unknown }> | null;
}

// Minimal jQuery type for our shim. We only need the fluent methods we actually call.
// Using `unknown`-based opaque types keeps this free of @types/jquery dependency.
type JQueryLike = {
  length: number;
  data(key: string): unknown;
  each(cb: (this: HTMLElement, i: number, el: HTMLElement) => void): JQueryLike;
  trigger(eventName: string): JQueryLike;
};
type JQueryStatic = ((selector: string | HTMLElement) => JQueryLike) & {
  fn?: { owlCarousel?: unknown };
};

declare global {
  interface Window {
    gsap?: { registerPlugin?: (plugin: unknown) => void };
    ScrollTrigger?: unknown;
    jQuery?: JQueryStatic;
    $?: JQueryStatic;
    gform_theme_config?: {
      common?: {
        form?: {
          honeypot?: { version_hash?: string };
          ajax?: {
            ajaxurl?: string;
            ajax_submission_nonce?: string;
            i18n?: Record<string, string>;
          };
        };
      };
      hmr_dev?: string;
      public_path?: string;
      config_nonce?: string;
    };
  }
}

function installSnapshotPluginStubs(): void {
  const w = window as Window;
  if (typeof w.gform_theme_config !== "undefined") return;
  w.gform_theme_config = {
    common: {
      form: {
        honeypot: { version_hash: "" },
        ajax: {
          ajaxurl: "/",
          ajax_submission_nonce: "",
          i18n: {
            step_announcement: "Step %1$s of %2$s, %3$s",
            unknown_error: "There was an unknown error processing your request. Please try again.",
          },
        },
      },
    },
    hmr_dev: "",
    public_path: "/",
    config_nonce: "",
  };
}

/**
 * Generic sequential snapshot loader.
 *
 * Loads CSS links + JS scripts in the exact order stored in SnapshotEntry.css/js —
 * preserving the cascade and plugin-init timing from the original site.
 *
 * Three critical timing rules enforced:
 *   1. GSAP ScrollTrigger registered after ScrollTrigger.min.js, before all.js
 *   2. document.body.classList.add("loaded") at loadedDelayMs (default 800ms)
 *   3. Inline scripts re-inserted at their original position indices
 */
export default function SnapshotClient({ entry, bodyHtml, widgetProps }: Props) {
  const injectedRef = useRef(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;
    installSnapshotPluginStubs();

    // Hydrate any ``data-react-widget`` marker found in the injected HTML.
    // No-op when no markers or no widgetProps — keeps the fallback path
    // working unchanged on sites where detect_widgets matched nothing.
    void mountWidgets(rootRef.current, widgetProps ?? null);

    // Set body dir for RTL locales
    if (entry.dir === "rtl") {
      document.documentElement.dir = "rtl";
    }

    // 1. CSS is now SSR'd via <link rel="stylesheet"> from page.tsx, so CSS
    //    downloads can start during the HTML parse — before hydration. The
    //    browser deduplicates identical hrefs, so we only re-inject any CSS
    //    that somehow got stripped (defensive; should be a no-op in prod).
    for (const href of entry.css) {
      if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    // 2. Inject JS scripts sequentially — each script waits for the previous to load.
    //
    // Group inline scripts by position into an array-per-position map.
    // Object.fromEntries silently drops duplicates when multiple inline scripts
    // share the same position (e.g. 11 scripts at position 13 on the about page);
    // a Map<number, string[]> preserves all of them in their original order.
    //
    // Defensive filter: older extract_fragment runs captured non-JS payloads
    // (e.g. JSON-LD blocks starting with `{"@context"`) as inline "scripts".
    // Injecting them as <script> would throw SyntaxError on the first colon.
    // Strip anything that clearly isn't JavaScript so this component stays safe
    // against registries produced by older extractors.
    const _looksLikeJson = (src: string): boolean => {
      const t = src.trimStart();
      return t.startsWith("{") || t.startsWith("[");
    };
    const inlineByPosition = new Map<number, string[]>();
    for (const s of entry.inlineScripts) {
      if (_looksLikeJson(s.code)) continue;
      const arr = inlineByPosition.get(s.position) ?? [];
      arr.push(s.code);
      inlineByPosition.set(s.position, arr);
    }

    const _runInlineAt = (pos: number) => {
      for (const code of inlineByPosition.get(pos) ?? []) {
        const el = document.createElement("script");
        el.textContent = code;
        document.body.appendChild(el);
      }
    };

    const loadScriptsSequentially = async () => {
      installSnapshotPluginStubs();
      for (let i = 0; i < entry.js.length; i++) {
        _runInlineAt(i);
        const src = entry.js[i];

        if (document.querySelector(`script[src="${src}"]`)) {
          if (entry.gsapHook && /ScrollTrigger\.min\.js/i.test(src)) {
            _registerGsap();
          }
          continue;
        }

        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => {
            // WordPress loads jQuery in no-conflict mode (jQuery.noConflict() at the
            // end of jquery.min.js removes window.$). Re-establish $ = jQuery after
            // every script so plugins and inline scripts that use bare $ still work.
            const jq = (window as unknown as { jQuery?: unknown }).jQuery;
            if (jq) (window as unknown as { $: unknown }).$ = jq;

            if (entry.gsapHook && /ScrollTrigger\.min\.js/i.test(src)) {
              _registerGsap();
            }
            resolve();
          };
          script.onerror = () => resolve();
          document.body.appendChild(script);
        });
      }

      _runInlineAt(entry.js.length);
    };

    loadScriptsSequentially().then(() => {
      // 3. Replay lifecycle events that scripts missed because they were
      //    injected dynamically after those events already fired.
      //
      //    Scripts commonly bind handlers to:
      //      - document.addEventListener("DOMContentLoaded", …)  ← scroll-shrink, nav init
      //      - $(window).on("load", …)                           ← WOW.js init, .show classes
      //    These events have already fired by the time Next.js mounts this
      //    component, so dynamically-injected scripts never see them.
      //    Dispatching synthetic events here re-triggers those handlers.
      try { document.dispatchEvent(new Event("DOMContentLoaded")); } catch (_) {}
      try { window.dispatchEvent(new Event("load")); } catch (_) {}

      // 4. Add .loaded class after configured delay (triggers CSS reveal animations)
      setTimeout(() => {
        document.body.classList.add("loaded");
        // Fire a synthetic scroll so scroll-based .show checks run for above-fold
        // elements that would never receive a scroll event otherwise.
        try { window.dispatchEvent(new Event("scroll")); } catch (_) {}

        // Fix aria-hidden-focus: remove tabindex from aria-hidden elements
        document.querySelectorAll('[aria-hidden="true"]').forEach((el) => {
          if ((el as HTMLElement).tabIndex === 0) {
            el.setAttribute('tabindex', '-1');
          }
          // Also fix any focusable descendants of hidden elements
          (el as HTMLElement).querySelectorAll('a, button, [tabindex]').forEach((child) => {
            child.setAttribute('tabindex', '-1');
          });
        });
      }, entry.loadedDelayMs ?? 800);

      // 5. Scroll-reveal fallback — two mechanisms in parallel:
      //
      //    a) Synthetic window.scroll events → jQuery handlers in all.js run when jQuery is healthy.
      //    b) Directly add .show to intersecting elements → works even when jQuery fails to init.
      //       ($.fn.isotope / $.fn.visible errors from plugin ordering issues break jQuery handlers;
      //       directly adding .show ensures opacity:0→1 transitions fire regardless.)
      //
      //    PLUS an immediate flush: reveal every element inside the snapshot root right now so
      //    content is never permanently hidden due to scroll-position timing or jQuery failure.
      const _fireScroll = () => {
        try { window.dispatchEvent(new Event("scroll")); } catch (_) {}
      };
      const snapshotRoot = document.querySelector("[data-snapshot-client]");
      if (snapshotRoot) {
        // Immediate flush: add .show to all descendants now. The .show class is a
        // progressive-enhancement reveal token — adding it to already-visible elements
        // is a no-op. For opacity:0 elements waiting for .show it makes them visible.
        snapshotRoot.querySelectorAll("*").forEach((el) => el.classList.add("show"));
        _fireScroll();

        // IO keeps adding .show for any elements injected after this point and keeps
        // firing scroll events so jQuery-based handlers also have a chance to run.
        if (typeof IntersectionObserver !== "undefined") {
          const sectionObserver = new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (!e.isIntersecting) continue;
                e.target.classList.add("show");
                _fireScroll();
              }
            },
            { root: null, threshold: 0, rootMargin: "0px" }
          );
          snapshotRoot
            .querySelectorAll(":scope > div, :scope > section, :scope > div > div")
            .forEach((el) => sectionObserver.observe(el));
        }
      }

      // 6. owlCarousel pointer-events drag shim.
      //
      //    owlCarousel 2.x binds only legacy `touchstart`/`mousedown` events.
      //    Modern mobile browsers (and DevTools mobile emulation) typically
      //    only fire pointer events. Even when pointer events DO fire, the
      //    browser may hijack the horizontal gesture and convert pointerup to
      //    pointercancel, treating it as a page scroll — unless the element
      //    opts out via `touch-action: pan-y`.
      //
      //    This shim:
      //      a) Sets `touch-action: pan-y` on every .owl-carousel so the browser
      //         releases horizontal pointers to the app.
      //      b) Tracks pointer delta via pointermove (works even if the final
      //         event is pointercancel) and fires next/prev at a 40px threshold.
      //      c) Bails out if the user is scrolling vertically (|dy| > |dx|).
      //
      //    This works in addition to — not instead of — owl's built-in drag,
      //    so desktop mouse-drag still works through owl's own handlers.
      setTimeout(() => {
        const $ = (window as unknown as { jQuery?: JQueryStatic }).jQuery;
        if (!$) return;
        const $carousels = $(".owl-carousel.owl-loaded");
        if (!$carousels.length) return;

        $carousels.each(function (this: HTMLElement) {
          const el = this;
          if ((el as HTMLElement & { __owlPointerShim?: boolean }).__owlPointerShim) return;
          (el as HTMLElement & { __owlPointerShim?: boolean }).__owlPointerShim = true;

          // (a) Let horizontal gestures reach the app. `pan-y` still allows
          // vertical page scroll, so users can scroll past the carousel.
          el.style.touchAction = "pan-y";

          let startX = 0;
          let startY = 0;
          let lastDx = 0;
          let lastDy = 0;
          let active = false;

          const finish = () => {
            if (!active) return;
            active = false;
            const dx = lastDx;
            const dy = lastDy;
            if (Math.abs(dy) > Math.abs(dx)) return; // vertical → page scroll
            if (Math.abs(dx) < 40) return;           // too short → treat as tap
            $(el).trigger(dx < 0 ? "next.owl.carousel" : "prev.owl.carousel");
          };

          el.addEventListener("pointerdown", (ev: PointerEvent) => {
            if (ev.button !== undefined && ev.button !== 0) return;
            startX = ev.clientX;
            startY = ev.clientY;
            lastDx = 0;
            lastDy = 0;
            active = true;
          }, { passive: true });

          el.addEventListener("pointermove", (ev: PointerEvent) => {
            if (!active) return;
            lastDx = ev.clientX - startX;
            lastDy = ev.clientY - startY;
          }, { passive: true });

          el.addEventListener("pointerup", finish, { passive: true });
          el.addEventListener("pointercancel", finish, { passive: true });
          el.addEventListener("pointerleave", finish, { passive: true });
        });
      }, (entry.loadedDelayMs ?? 800) + 200);

      // 7. owlCarousel mobile-resize fix.
      //
      //    CSS hides .owl-carousel elements on desktop (display:none!important)
      //    and shows them on mobile (≤767px). If the page loads on desktop, owl
      //    initialises on a hidden element and measures 0-width items. When the
      //    user resizes to mobile, the container becomes visible but items have
      //    wrong dimensions. Trigger owl's 'refresh' on every crossing of the
      //    767px boundary.
      {
        let wasMobile = window.innerWidth <= 767;
        const handleOwlResize = () => {
          const isMobile = window.innerWidth <= 767;
          if (isMobile === wasMobile) return;
          wasMobile = isMobile;
          const jq = (window as unknown as { jQuery?: JQueryStatic }).jQuery;
          if (!jq) return;
          const $owls = jq(".owl-carousel");
          if ($owls.length) $owls.trigger("refresh.owl.carousel");
        };
        window.addEventListener("resize", handleOwlResize, { passive: true });
      }
    });

    return () => {
      unmountWidgets(rootRef.current);
    };
  }, [entry, widgetProps]);

  return (
    <main
      ref={rootRef as React.RefObject<HTMLElement>}
      data-snapshot-client
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}

function _registerGsap() {
  if (window.gsap?.registerPlugin && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }
}

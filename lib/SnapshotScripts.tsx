"use client";

import { useEffect, useRef } from "react";
import type { SnapshotEntry } from "./snapshotRegistry";

interface Props {
  entry: SnapshotEntry;
}

declare global {
  interface Window {
    gsap?: { registerPlugin?: (plugin: unknown) => void };
    ScrollTrigger?: unknown;
  }
}

export default function SnapshotScripts({ entry }: Props) {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    if (entry.dir === "rtl") {
      document.documentElement.dir = "rtl";
    }

    for (const href of entry.css) {
      if (document.querySelector(`link[href="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    const looksLikeJson = (src: string): boolean => {
      const t = src.trimStart();
      return t.startsWith("{") || t.startsWith("[");
    };
    const inlineByPosition = new Map<number, string[]>();
    for (const s of entry.inlineScripts) {
      if (looksLikeJson(s.code)) continue;
      const arr = inlineByPosition.get(s.position) ?? [];
      arr.push(s.code);
      inlineByPosition.set(s.position, arr);
    }

    const runInlineAt = (pos: number) => {
      for (const code of inlineByPosition.get(pos) ?? []) {
        const el = document.createElement("script");
        el.textContent = code;
        document.body.appendChild(el);
      }
    };

    const registerGsap = () => {
      if (window.gsap?.registerPlugin && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }
    };

    // Re-establish $ = jQuery after every script load so plugins that call
    // $.fn or $(document).ready() after jQuery.noConflict() find a live $.
    const reEstablishJQuery = () => {
      const w = window as unknown as Record<string, unknown>;
      if (w["jQuery"] && w["$"] !== w["jQuery"]) {
        w["$"] = w["jQuery"];
      }
    };

    const loadScriptsSequentially = async () => {
      for (let i = 0; i < entry.js.length; i++) {
        runInlineAt(i);
        const src = entry.js[i];

        if (document.querySelector(`script[src="${src}"]`)) {
          reEstablishJQuery();
          if (entry.gsapHook && /ScrollTrigger\.min\.js/i.test(src)) {
            registerGsap();
          }
          continue;
        }

        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => {
            reEstablishJQuery();
            if (entry.gsapHook && /ScrollTrigger\.min\.js/i.test(src)) {
              registerGsap();
            }
            resolve();
          };
          script.onerror = () => resolve();
          document.body.appendChild(script);
        });
      }

      runInlineAt(entry.js.length);
      reEstablishJQuery();
    };

    loadScriptsSequentially().then(() => {
      try {
        document.dispatchEvent(new Event("DOMContentLoaded"));
      } catch {}
      try {
        window.dispatchEvent(new Event("load"));
      } catch {}
      setTimeout(() => {
        document.body.classList.add("loaded");
        try {
          window.dispatchEvent(new Event("scroll"));
        } catch {}
      }, entry.loadedDelayMs ?? 800);
    });
  }, [entry]);

  return null;
}

"use client";

/**
 * Client-side island mounter for widget markers inside HTML snapshots.
 *
 * The primary code path is compile-time: ``engine/transpile_jsx`` writes real
 * ``<WidgetCarousel {...props} />`` JSX into each page's body component. This
 * mounter is the runtime fallback used ONLY when a page falls back to the
 * ``SnapshotClient`` (``dangerouslySetInnerHTML``) rendering path — the
 * markers are still in the HTML, so we scan for them and attach React roots.
 *
 * The widget registry is lazy-loaded: each widget is ``import()``ed the first
 * time a marker for it is seen on the page, so pages that don't use a given
 * widget never ship its JS.
 */
import { createRoot, type Root } from "react-dom/client";
import { createElement, type ComponentType } from "react";

type WidgetPropsMap = Record<string, { type: string; props: unknown }>;

const MARKER_ATTR = "data-react-widget";
const ID_ATTR = "data-widget-id";
const MOUNTED_ATTR = "data-react-widget-mounted";

const loaders: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  Carousel: () => import("@/components/widgets/Carousel"),
  Accordion: () => import("@/components/widgets/Accordion"),
  FAQ: () => import("@/components/widgets/FAQ"),
  ContactForm: () => import("@/components/widgets/ContactForm"),
  Ticker: () => import("@/components/widgets/Ticker"),
};

const moduleCache: Record<string, ComponentType<any>> = {};
const rootRegistry = new WeakMap<Element, Root>();

export async function mountWidgets(
  container: Element | null,
  propsMap: WidgetPropsMap | null | undefined,
): Promise<void> {
  if (!container) return;
  const safeProps: WidgetPropsMap = propsMap ?? {};
  const markers = container.querySelectorAll(
    `[${MARKER_ATTR}][${ID_ATTR}]:not([${MOUNTED_ATTR}])`,
  );

  await Promise.all(
    Array.from(markers).map(async (el) => {
      const type = el.getAttribute(MARKER_ATTR) || "";
      const id = el.getAttribute(ID_ATTR) || "";
      if (!type || !id) return;

      const entry = safeProps[id];
      const props = entry && typeof entry === "object" ? entry.props : {};

      const Component = await loadWidget(type);
      if (!Component) return;

      el.setAttribute(MOUNTED_ATTR, "1");
      const root = createRoot(el);
      rootRegistry.set(el, root);
      root.render(createElement(Component, props as Record<string, unknown>));
    }),
  );
}

export function unmountWidgets(container: Element | null): void {
  if (!container) return;
  const mounted = container.querySelectorAll(`[${MOUNTED_ATTR}]`);
  mounted.forEach((el) => {
    const root = rootRegistry.get(el);
    if (root) {
      root.unmount();
      rootRegistry.delete(el);
    }
    el.removeAttribute(MOUNTED_ATTR);
  });
}

async function loadWidget(type: string): Promise<ComponentType<any> | null> {
  if (moduleCache[type]) return moduleCache[type];
  const loader = loaders[type];
  if (!loader) return null;
  try {
    const mod = await loader();
    moduleCache[type] = mod.default;
    return mod.default;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[widgets] failed to load ${type}:`, err);
    }
    return null;
  }
}

"use client";

import { ReactLenis } from "lenis/react";
import { type ReactNode, useEffect, useState } from "react";

/**
 * Lenis is scoped to the marketing routes on purpose. It hijacks native
 * scrolling, which breaks scrollIntoView for form validation errors and
 * fights the mobile keyboard — so it must never wrap /apply.
 *
 * Starts disabled so SSR and no-JS visitors get native scroll, and stays
 * disabled for anyone who asked for reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (!enabled) return children;

  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}

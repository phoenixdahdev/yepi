"use client";

import { useInView } from "motion/react";
import { type ReactNode, useRef } from "react";

/**
 * Motion supplies only the viewport detection; the movement itself is a CSS
 * transition (see .reveal in globals.css) so it stays off the main thread and
 * inherits the reduced-motion variant for free.
 *
 * Fires once — re-animating on every scroll-by fights the reader.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      data-visible={inView || undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

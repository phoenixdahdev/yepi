"use client";

import { useInView } from "motion/react";
import { useRef } from "react";

/**
 * Guideline §01 and §05 — the brand's central image: two paths converging,
 * an arrow rising between them. Equal band widths, cropped by the frame,
 * blue and mint always together.
 *
 * Plays when it scrolls into view. The hidden state is scoped to .js in CSS,
 * so without JavaScript — a crawler, a preview renderer — the graphic is
 * simply there rather than permanently clipped out of existence.
 */
export function ConvergingPaths({
  className,
  fit = "slice",
}: {
  className?: string;
  /** "meet" shows the whole graphic — the convergence and the arrowhead —
   *  rather than cropping to whatever the container happens to be. */
  fit?: "slice" | "meet";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <div
      ref={ref}
      data-visible={inView || undefined}
      className={`paths ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 480 640"
        preserveAspectRatio={`xMidYMax ${fit}`}
        className="h-full w-full"
      >
        <g fill="none" strokeWidth="88">
          <g className="path-sweep">
            <path
              d="M40 700 C40 480 150 470 150 290 L150 -40"
              stroke="var(--color-blue)"
            />
          </g>
          <g className="path-sweep path-sweep--mint">
            <path
              d="M440 700 C440 480 330 470 330 290 L330 -40"
              stroke="var(--color-mint)"
            />
          </g>
        </g>
        <g className="arrow-rise">
          <path
            d="M240 116 L286 210 L257 210 L257 620 L223 620 L223 210 L194 210 Z"
            fill="#ffffff"
          />
        </g>
      </svg>
    </div>
  );
}

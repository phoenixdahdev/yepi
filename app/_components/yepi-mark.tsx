/**
 * RECONSTRUCTION — not the official asset.
 *
 * Redrawn from the YEPI Design Guideline §02 because no logo files were
 * supplied. Two converging paths forming a Y, with the arrow rising
 * between them. When the real SVGs arrive, replace the contents of this
 * file only; every caller goes through <YepiMark /> and <YepiLockup />.
 */

export function YepiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="YEPI"
      className={className}
    >
      <defs>
        {/* Guideline §05: paths are cropped by the frame, never bleeding past it. */}
        <clipPath id="yepi-mark-frame">
          <rect width="120" height="120" rx="25" />
        </clipPath>
      </defs>
      <rect width="120" height="120" rx="25" fill="var(--color-navy)" />
      <g clipPath="url(#yepi-mark-frame)" fill="none" strokeWidth="22">
        <path d="M24 114 L24 68 C24 52 40 48 40 32 L40 4" stroke="var(--color-blue)" />
        <path d="M96 114 L96 68 C96 52 80 48 80 32 L80 4" stroke="var(--color-mint)" />
      </g>
      {/* The rise arrow — always points up (guideline §05). */}
      <path
        d="M60 6 L69 24 L64.5 24 L64.5 102 L55.5 102 L55.5 24 L51 24 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

/**
 * Primary horizontal logo: mark + wordmark + subline.
 * `tone` follows guideline §02 version 01 (on light) and 04 (reversed on navy).
 */
export function YepiLockup({
  tone = "light",
  className,
}: {
  tone?: "light" | "reversed";
  className?: string;
}) {
  const ink = tone === "reversed" ? "text-white" : "text-navy";

  return (
    <div className={`flex items-center gap-3 ${ink} ${className ?? ""}`}>
      <YepiMark className="h-11 w-11 shrink-0" />
      <div className="leading-none">
        <div className="type-display text-[1.75rem] tracking-[-0.03em]">YEPI</div>
        <div className="type-label mt-1 text-[0.5rem] tracking-[0.2em] opacity-90">
          Young Entrepreneurs
          <br />
          Pitch Initiative
        </div>
      </div>
    </div>
  );
}

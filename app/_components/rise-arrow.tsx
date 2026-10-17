/**
 * Guideline §05 — "The arrow alone marks progress: prize tiers, timeline
 * steps, bullets. Always points up." Height encodes rank, so the caller
 * sets it. The head keeps its proportions at any height; only the shaft
 * stretches.
 */
export function RiseArrow({
  tone,
  className,
}: {
  tone: "blue" | "mint" | "navy" | "white";
  className?: string;
}) {
  const color = {
    blue: "var(--color-blue)",
    mint: "var(--color-mint)",
    navy: "var(--color-navy)",
    white: "#ffffff",
  }[tone];

  return (
    <div
      className={`flex flex-col items-center ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 20" className="w-full shrink-0">
        <path d="M12 0 L24 20 L0 20 Z" fill={color} />
      </svg>
      <div className="w-[37.5%] flex-1" style={{ background: color }} />
    </div>
  );
}

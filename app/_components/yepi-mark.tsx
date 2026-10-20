import Image from "next/image";

/**
 * The supplied logo pack (public/brand). Text in these SVGs is outlined, so
 * they need no font and can be served as plain images.
 *
 * Reversed variants are white-on-transparent and must only ever sit on navy —
 * the pack is explicit that the colour mark is never used on a dark field.
 * Minimum widths from the pack: 160px horizontal, 24px for the mark alone.
 */

const HORIZONTAL = { w: 456, h: 150 };
const ENDORSED = { w: 914, h: 150 };
const MARK = { w: 100, h: 100 };

export function YepiLockup({
  tone = "light",
  className,
}: {
  tone?: "light" | "reversed";
  className?: string;
}) {
  return (
    <Image
      src={
        tone === "reversed"
          ? "/brand/yepi-horizontal-reversed.svg"
          : "/brand/yepi-horizontal.svg"
      }
      alt="YEPI — Young Entrepreneurs Pitch Initiative"
      width={HORIZONTAL.w}
      height={HORIZONTAL.h}
      priority
      unoptimized
      className={className ?? "h-14 w-auto"}
    />
  );
}

/**
 * Required on external comms. Carries "A programme of Wisdom for Business
 * Conference 2026" beside the logo, replacing the typeset version we used
 * before the official artwork arrived.
 */
export function YepiEndorsed({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/yepi-endorsed-horizontal-reversed.svg"
      alt="YEPI — a programme of the Wisdom for Business Conference 2026"
      width={ENDORSED.w}
      height={ENDORSED.h}
      unoptimized
      className={className ?? "h-14 w-auto"}
    />
  );
}

export function YepiMark({
  tone = "light",
  className,
}: {
  tone?: "light" | "reversed";
  className?: string;
}) {
  return (
    <Image
      src={tone === "reversed" ? "/brand/yepi-mark-reversed.svg" : "/brand/yepi-mark.svg"}
      alt="YEPI"
      width={MARK.w}
      height={MARK.h}
      unoptimized
      className={className ?? "h-10 w-10"}
    />
  );
}

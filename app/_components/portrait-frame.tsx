import Image from "next/image";

/**
 * Guideline §05 — mark-radius frames: radius = 21% of the shorter side. The
 * frame is square, so 21% of the width is exactly that.
 *
 * With no photograph it renders a plain portrait slot: a tonal field, a
 * simple figure, and one brand accent. It is meant to read as "a photograph
 * belongs here", not as an abstract graphic pretending to be finished art.
 */
export function PortraitFrame({
  photo,
  alt,
  tone,
  className,
}: {
  photo?: string;
  alt?: string;
  tone: 0 | 1 | 2;
  className?: string;
}) {
  const accent = [
    "var(--color-blue)",
    "var(--color-mint)",
    "#ffffff",
  ][tone];

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-[21%] ${className ?? ""}`}
      style={
        photo
          ? undefined
          : { background: "color-mix(in oklab, #ffffff 9%, var(--color-navy))" }
      }
    >
      {photo ? (
        <Image src={photo} alt={alt ?? ""} fill className="object-cover" sizes="25vw" />
      ) : (
        <svg viewBox="0 0 200 200" aria-hidden="true" className="h-full w-full">
          {/* head and shoulders, centred and cropped by the frame */}
          <circle cx="100" cy="78" r="30" fill="#ffffff" opacity="0.22" />
          <path
            d="M36 200 C36 150 64 124 100 124 C136 124 164 150 164 200 Z"
            fill="#ffffff"
            opacity="0.22"
          />
          {/* one accent, so the row still reads as blue-and-mint together */}
          <rect x="0" y="186" width="200" height="14" fill={accent} opacity="0.85" />
        </svg>
      )}
    </div>
  );
}

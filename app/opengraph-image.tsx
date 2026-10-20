import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { programme } from "./_content/programme";

export const alt = `${programme.name} — ${programme.prize.pool} for young founders. ${programme.event.date}, ${programme.event.location}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#0b1f4f";
const BLUE = "#1769ff";
const MINT = "#1de59a";

/**
 * Built from flex boxes rather than the SVG the site uses: satori supports a
 * subset of CSS, and solid blocks render predictably where stroked paths and
 * clip-paths do not.
 */
export default async function Image() {
  const [black, regular, mark] = await Promise.all([
    readFile(join(process.cwd(), "assets", "Archivo-900.ttf")),
    readFile(join(process.cwd(), "assets", "Archivo-400.ttf")),
    readFile(join(process.cwd(), "public", "brand", "yepi-mark-reversed-512.png")),
  ]);
  // satori has no filesystem; the mark travels inline.
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: NAVY,
          color: "#ffffff",
          fontFamily: "Archivo",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "72px 80px 56px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: 4,
                color: MINT,
              }}
            >
              YEPI · AGES {programme.eligibility.ageRange}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 34,
                fontSize: 104,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: -3,
                maxWidth: 760,
              }}
            >
              {programme.prize.pool} for young founders.
            </div>

            <div style={{ flex: 1 }} />

            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 400,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              {programme.event.date} · {programme.event.location}
            </div>
          </div>

          {/* The official mark already carries the two paths and the rising
              arrow, so it stands in for the graphic we drew by hand. */}
          <div style={{ display: "flex", alignItems: "center", marginLeft: 56 }}>
            <img src={markSrc} width={300} height={300} alt="" />
          </div>
        </div>

        {/* Guideline §05 — the lane rule always sits at the foot. */}
        <div style={{ display: "flex", height: 14 }}>
          <div style={{ display: "flex", flex: 1, background: BLUE }} />
          <div style={{ display: "flex", width: 28, background: "#ffffff" }} />
          <div style={{ display: "flex", flex: 1, background: MINT }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: black, style: "normal", weight: 900 },
        { name: "Archivo", data: regular, style: "normal", weight: 400 },
      ],
    },
  );
}

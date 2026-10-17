import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icons are composited onto a solid tile, so this one is drawn
 *  edge to edge with the mark inset rather than relying on a rounded mask. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1f4f",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div style={{ display: "flex", width: 26, height: 72, background: "#1769ff" }} />
          <div style={{ display: "flex", width: 26, height: 104, background: "#ffffff" }} />
          <div style={{ display: "flex", width: 26, height: 86, background: "#1de59a" }} />
        </div>
      </div>
    ),
    size,
  );
}

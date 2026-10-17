import type { MetadataRoute } from "next";
import { programme } from "./_content/programme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${programme.name} — ${programme.fullName}`,
    short_name: programme.name,
    description: `${programme.prize.pool} for young founders. ${programme.parent}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1f4f",
    theme_color: "#0b1f4f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}

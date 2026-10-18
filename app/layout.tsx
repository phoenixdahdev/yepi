import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { programme } from "./_content/programme";
import { QueryProvider } from "./_components/query-provider";
import { siteOrigin } from "./_lib/site";
import { cn } from "@/lib/utils";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const description = `${programme.prize.pool} for young founders. ${programme.fullName}, the flagship entrepreneurship track of the ${programme.parent}. Open to founders aged ${programme.eligibility.ageRange} with a valid South African ID. A registered company is not required.`;

export const metadata: Metadata = {
  // Makes every relative URL below — and the generated OG image — absolute.
  metadataBase: new URL(siteOrigin()),
  title: {
    default: `${programme.name} — ${programme.tagline}`,
    template: `%s · ${programme.name}`,
  },
  description,
  applicationName: programme.name,
  category: "education",
  keywords: [
    "YEPI",
    "Young Entrepreneurs Pitch Initiative",
    "pitch competition South Africa",
    "young founders funding",
    "startup grant Johannesburg",
    programme.parent,
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/",
    siteName: programme.name,
    title: `${programme.prize.pool} for young founders`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${programme.prize.pool} for young founders`,
    description,
  },
  robots: { index: true, follow: true },
  // South African mobile numbers get mangled into tel: links otherwise.
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b1f4f",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={cn("h-full", "antialiased", "font-sans", archivo.variable)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
      <body className="min-h-full font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

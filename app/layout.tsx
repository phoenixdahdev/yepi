import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { programme } from "./_content/programme";
import { QueryProvider } from "./_components/query-provider";
import { cn } from "@/lib/utils";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${programme.name} — ${programme.tagline}`,
    template: `%s · ${programme.name}`,
  },
  description: `${programme.prize.pool} for young founders. ${programme.fullName}, the flagship entrepreneurship track of the ${programme.parent}. Applications are open to founders aged ${programme.eligibility.ageRange} — no South African citizenship or CIPC registration required to apply.`,
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

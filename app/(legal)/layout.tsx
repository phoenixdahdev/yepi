import Link from "next/link";
import { YepiLockup } from "../_components/yepi-mark";

export default function LegalLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col bg-mist">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <Link href="/" aria-label="YEPI home">
            <YepiLockup />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        {children}
      </main>

      <div className="flex h-1.5" aria-hidden="true">
        <div className="flex-1 bg-blue" />
        <div className="w-6 bg-white" />
        <div className="flex-1 bg-mint" />
      </div>

      <footer className="bg-navy px-6 py-8 text-white">
        <p className="mx-auto max-w-3xl text-sm text-white/60">
          <Link href="/" className="underline underline-offset-4">
            YEPI
          </Link>{" "}
          · A programme of the Wisdom for Business Conference 2026
        </p>
      </footer>
    </div>
  );
}

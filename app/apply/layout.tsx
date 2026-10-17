import Link from "next/link";
import { YepiLockup } from "../_components/yepi-mark";
import { StepProgress } from "./_components/step-progress";

/**
 * Every step reads the draft cookie, which cannot be prerendered into the
 * static shell, so this segment is allowed to block on the server.
 */
export const instant = false;

export const metadata = {
  title: "Apply",
};

export default function ApplyLayout({ children }: LayoutProps<"/apply">) {
  return (
    <div className="flex min-h-full flex-col bg-mist">
      <header className="border-b border-navy/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <Link href="/" aria-label="YEPI home">
            <YepiLockup />
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-6 pt-10">
        <StepProgress />
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-navy/10 px-6 py-8">
        <p className="mx-auto max-w-3xl text-sm text-navy/50">
          We never ask for an ID number or a company registration number to
          apply.{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            How we handle your information
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}

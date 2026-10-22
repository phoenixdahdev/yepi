import Link from "next/link";
import { requireAdmin } from "../../_lib/admin";
import { YepiLockup } from "../../_components/yepi-mark";
import { signOut } from "./actions";

/** Reads the organiser cookie on every request; nothing here is cacheable. */
export const instant = false;

export const metadata = {
  title: "Applications",
  // Applicants' personal information. Never to be indexed, regardless of
  // what robots.txt says.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const email = await requireAdmin();

  return (
    <div className="flex min-h-full flex-col bg-mist">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-5">
            <Link href="/admin" aria-label="Applications">
              <YepiLockup className="h-10 w-auto" />
            </Link>
            <span className="type-label text-blue">Organisers</span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className="text-muted-foreground">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}

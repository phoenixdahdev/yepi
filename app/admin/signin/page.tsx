import Link from "next/link";
import { YepiLockup } from "../../_components/yepi-mark";
import { AdminSigninForm } from "../_components/signin-form";

export const metadata = { title: "Organiser sign-in", robots: { index: false } };
export const instant = false;

export default function AdminSigninPage() {
  return (
    <div className="flex min-h-full flex-col bg-mist">
      <header className="border-b border-border bg-white">
        <div className="mx-auto max-w-2xl px-6 py-6">
          <Link href="/" aria-label="YEPI home">
            <YepiLockup />
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-14">
        <p className="type-label text-blue">Organisers</p>
        <h1 className="type-display mt-4 text-h2">Sign in</h1>
        <p className="mt-4 max-w-lg text-body text-muted-foreground">
          Organiser access only. Applications contain personal information
          that applicants gave us in confidence.
        </p>
        <div className="mt-10">
          <AdminSigninForm />
        </div>
      </main>
    </div>
  );
}

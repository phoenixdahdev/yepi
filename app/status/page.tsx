import Link from "next/link";
import { STATUS_VIEW, findById } from "../_lib/application";
import { currentStatusId } from "../_lib/draft-session";
import { YepiLockup } from "../_components/yepi-mark";
import { programme } from "../_content/programme";
import { RequestLinkForm } from "./_components/request-form";

/** Reads the status cookie on every request, so it cannot be prerendered. */
export const instant = false;

export const metadata = { title: "Your application" };

const TONE = {
  mint: "bg-mint text-navy",
  blue: "bg-blue text-white",
  navy: "bg-navy text-white",
} as const;

export default async function StatusPage({ searchParams }: PageProps<"/status">) {
  const params = await searchParams;
  const id = await currentStatusId();

  let application = null;
  if (id) {
    try {
      application = await findById(id);
    } catch (error) {
      console.error("[status] load", error);
    }
  }

  const view =
    application && application.status !== "draft"
      ? STATUS_VIEW[application.status]
      : null;

  return (
    <div className="flex min-h-full flex-col bg-mist">
      <header className="border-b border-navy/10 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <Link href="/" aria-label="YEPI home">
            <YepiLockup />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        <p className="type-label text-blue">Your application</p>

        {view && application ? (
          <>
            <h1 className="type-display mt-4 text-h2">
              {application.venture?.ventureName ?? "Your application"}
            </h1>

            <div
              className={`mt-8 inline-flex items-center rounded-full px-6 py-3 ${TONE[view.tone]}`}
            >
              <span className="type-label">{view.label}</span>
            </div>

            <p className="mt-7 max-w-xl text-body text-navy/75">{view.meaning}</p>

            {view.action ? (
              <div className="mt-8 rounded-2xl border-2 border-navy/12 bg-white p-6 sm:p-8">
                <h2 className="type-heading text-lg">What we need from you</h2>
                <p className="mt-3 text-body text-navy/75">{view.action}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-navy/55">
                Nothing is needed from you right now. We will email you when
                this changes.
              </p>
            )}

            <dl className="mt-12 divide-y divide-navy/10 border-y border-navy/10">
              <div className="flex justify-between gap-6 py-4">
                <dt className="type-label text-navy/55">Reference</dt>
                <dd className="text-body font-semibold">
                  {application.id.slice(0, 8).toUpperCase()}
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="type-label text-navy/55">Submitted</dt>
                <dd className="text-body">
                  {application.submittedAt
                    ? new Intl.DateTimeFormat("en-ZA", {
                        dateStyle: "long",
                      }).format(application.submittedAt)
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-4">
                <dt className="type-label text-navy/55">Final event</dt>
                <dd className="text-body">{programme.event.date}</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <h1 className="type-display mt-4 text-h2">Check your status</h1>
            <p className="mt-4 max-w-xl text-body text-navy/70">
              We&rsquo;ll email you a link rather than ask for a password.
            </p>
            <div className="mt-10">
              <RequestLinkForm expired={params.link === "expired"} />
            </div>
            <p className="mt-8 text-sm text-navy/55">
              Haven&rsquo;t applied yet?{" "}
              <Link href="/apply" className="underline underline-offset-4">
                Start an application
              </Link>
              .
            </p>
          </>
        )}
      </main>
    </div>
  );
}

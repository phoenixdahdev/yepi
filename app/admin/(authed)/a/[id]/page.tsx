import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { requireAdmin } from "../../../../_lib/admin";
import { findById } from "../../../../_lib/application";
import { ADMIN_STATUS } from "../../../_status";
import { ReviewPanel } from "../../../_components/review-panel";

const fmt = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Johannesburg",
});

const size = (b: number) =>
  b >= 1024 * 1024 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

function Row({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-border py-4 sm:grid-cols-[12rem_1fr] sm:gap-5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-body break-words whitespace-pre-wrap">
        {value === undefined || value === "" || value === null ? (
          <span className="text-muted-foreground">Not provided</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 sm:p-8">
      <h2 className="type-label text-navy/55">{title}</h2>
      <dl className="mt-3">{children}</dl>
    </section>
  );
}

export default async function AdminDetailPage({
  params,
}: PageProps<"/admin/a/[id]">) {
  const me = await requireAdmin();
  const { id } = await params;
  const a = await findById(id);
  if (!a) notFound();

  const { founder, venture, traction, materials, consent, review, history } = a;
  const badge = ADMIN_STATUS[a.status];
  const scoreKey = me.replace(/\./g, "_");

  return (
    <>
      <Link
        href="/admin"
        className="text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        ← All applications
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="type-display text-h2">
            {venture?.ventureName ?? founder?.fullName ?? "Application"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Reference {a.id.slice(0, 8).toUpperCase()} · updated {fmt.format(a.updatedAt)}
          </p>
        </div>
        <span className={`type-label rounded-full px-4 py-2 ${badge.tone}`}>
          {badge.label}
        </span>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="space-y-6">
          <Section title="Founder">
            <Row label="Full name" value={founder?.fullName} />
            <Row
              label={founder?.idType === "passport" ? "Passport" : "ID number"}
              value={
                founder?.idType === "passport"
                  ? [founder.passportNumber, founder.nationality].filter(Boolean).join(" · ")
                  : founder?.idNumber
              }
            />
            <Row label="Date of birth" value={founder?.dateOfBirth} />
            <Row
              label="Email"
              value={
                founder?.email ? (
                  <a href={`mailto:${founder.email}`} className="underline underline-offset-4">
                    {founder.email}
                  </a>
                ) : undefined
              }
            />
            <Row label="Mobile" value={founder?.mobile} />
            <Row label="Profile" value={founder?.profileUrl} />
          </Section>

          <Section title="Venture">
            <Row label="Name" value={venture?.ventureName} />
            <Row label="What it does" value={venture?.description} />
            <Row label="Location" value={venture?.location} />
            <Row label="Stage" value={venture?.stage} />
            <Row label="Website" value={venture?.website} />
            <Row label="CIPC-registered" value={venture?.cipcStatus} />
          </Section>

          <Section title="Traction">
            <Row label="Operating for" value={traction?.operatingSince} />
            <Row label="Progress" value={traction?.progress} />
            <Row label="People involved" value={traction?.teamSize} />
          </Section>

          <Section title="Pitch">
            <Row label="Executive summary" value={materials?.executiveSummary} />
            <Row label="Elevator pitch" value={materials?.elevatorPitch} />
            <Row
              label="Pitch deck"
              value={
                materials?.pitchDeck ? (
                  <a
                    href={materials.pitchDeck.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline underline-offset-4"
                  >
                    {materials.pitchDeck.filename} ({size(materials.pitchDeck.size)})
                  </a>
                ) : undefined
              }
            />
            <Row
              label="Supporting"
              value={
                materials?.supporting?.length ? (
                  <ul className="space-y-1">
                    {materials.supporting.map((f) => (
                      <li key={f.pathname}>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-4"
                        >
                          {f.filename} ({size(f.size)})
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : undefined
              }
            />
          </Section>

          <Section title="Consent">
            <Row
              label="Accepted"
              value={
                consent
                  ? `${fmt.format(consent.acceptedAt)} · policy ${consent.policyVersion}`
                  : undefined
              }
            />
            <Row label="Submitted" value={a.submittedAt ? fmt.format(a.submittedAt) : undefined} />
          </Section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8">
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <h2 className="type-label text-navy/55">Review</h2>
            <div className="mt-5">
              <ReviewPanel
                id={a.id}
                status={a.status}
                notes={review?.notes ?? ""}
                myScore={review?.scores?.[scoreKey]}
              />
            </div>
          </div>

          {history?.length ? (
            <div className="rounded-2xl bg-white p-6 sm:p-8">
              <h2 className="type-label text-navy/55">History</h2>
              <ol className="mt-4 space-y-3 text-sm">
                {[...history].reverse().map((h, i) => (
                  <li key={i} className="border-t border-border pt-3 first:border-0 first:pt-0">
                    <span className="font-semibold">
                      {ADMIN_STATUS[h.from]?.label} → {ADMIN_STATUS[h.to]?.label}
                    </span>
                    <span className="block text-muted-foreground">
                      {h.by} · {fmt.format(h.at)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}

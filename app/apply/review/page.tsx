import Link from "next/link";
import type { ReactNode } from "react";
import { requireDraft } from "../_lib";
import { requireApplicationsOpen } from "../../_lib/applications";
import { ConsentForm } from "../_components/consent-form";
import { STEPS } from "../_steps";

function Section({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-navy/10 py-7 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="type-label text-navy/55">{title}</h2>
        <Link
          href={editHref}
          className="text-sm font-semibold text-blue underline underline-offset-4"
        >
          Edit
        </Link>
      </div>
      <dl className="mt-4 space-y-3">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm text-navy/55">{label}</dt>
      <dd className="text-body break-words whitespace-pre-wrap">
        {value === undefined || value === "" || value === null ? (
          <span className="text-navy/40">Not provided</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default async function ReviewStep() {
  requireApplicationsOpen();
  const draft = await requireDraft();
  const { founder, venture, traction, materials } = draft;

  return (
    <>
      <p className="type-label text-blue">{STEPS[4].eyebrow}</p>
      <h1 className="type-display mt-4 text-h2">Check and submit</h1>
      <p className="mt-4 max-w-xl text-body text-navy/70">
        Nothing is submitted until you press the button at the bottom. You can
        still change any answer.
      </p>

      <div className="mt-12 rounded-2xl bg-white p-6 sm:p-8">
        <Section title="About you" editHref="/apply">
          <Row label="Full name" value={founder?.fullName} />
          <Row
            label={founder?.idType === "passport" ? "Passport" : "ID number"}
            value={
              founder?.idType === "passport"
                ? [founder.passportNumber, founder.nationality]
                    .filter(Boolean)
                    .join(" · ")
                : founder?.idNumber
            }
          />
          <Row label="Date of birth" value={founder?.dateOfBirth} />
          <Row label="Email" value={founder?.email} />
          <Row label="Mobile" value={founder?.mobile} />
          <Row label="Profile" value={founder?.profileUrl} />
        </Section>

        <Section title="Your venture" editHref="/apply/venture">
          <Row label="Name" value={venture?.ventureName} />
          <Row label="What it does" value={venture?.description} />
          <Row label="Location" value={venture?.location} />
          <Row label="Stage" value={venture?.stage} />
          <Row label="Website" value={venture?.website} />
          <Row label="CIPC-registered" value={venture?.cipcStatus} />
        </Section>

        <Section title="Traction" editHref="/apply/traction">
          <Row label="Operating for" value={traction?.operatingSince} />
          <Row label="Progress" value={traction?.progress} />
          <Row label="People involved" value={traction?.teamSize} />
        </Section>

        <Section title="Your pitch" editHref="/apply/materials">
          <Row label="Executive summary" value={materials?.executiveSummary} />
          <Row label="Elevator pitch" value={materials?.elevatorPitch} />
          <Row label="Pitch deck" value={materials?.pitchDeck?.filename} />
          <Row
            label="Supporting documents"
            value={
              materials?.supporting?.length
                ? materials.supporting.map((f) => f.filename).join(", ")
                : undefined
            }
          />
        </Section>
      </div>

      <div className="mt-10">
        <ConsentForm />
      </div>
    </>
  );
}

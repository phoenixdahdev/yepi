import type { Metadata } from "next";
import Link from "next/link";
import {
  POLICY_VERSION,
  organisation as org,
} from "../../_content/organisation";
import { programme } from "../../_content/programme";
import { Bullets, Pending, Section } from "../_components/prose";

export const metadata: Metadata = {
  title: "Terms of participation",
  description: `The rules for entering ${programme.fullName} (${programme.name}).`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const { prize, eligibility, event } = programme;

  return (
    <article>
      <p className="type-label text-blue">Terms</p>
      <h1 className="type-display mt-4 text-h2">Terms of participation</h1>
      <p className="mt-5 max-w-xl text-body text-muted-foreground">
        These are the rules for entering {programme.fullName} ({programme.name}
        ). By submitting an application you agree to them. They sit alongside
        our{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          privacy notice
        </Link>
        , which explains how we handle your information.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Version {POLICY_VERSION} · In effect from {org.effectiveDate}.
      </p>

      <div className="mt-14 space-y-10">
        <Section id="organiser" n={1} title="Who is running this">
          <p>
            {programme.name} is run by{" "}
            <strong className="text-foreground">
              <Pending value={org.legalName} />
            </strong>{" "}
            (&ldquo;we&rdquo;, &ldquo;us&rdquo;) as the entrepreneurship track
            of the {programme.parent}. The final event takes place on{" "}
            {event.date} in {event.location}.
          </p>
        </Section>

        <Section id="eligibility" n={2} title="Who can enter">
          <Bullets
            items={[
              <>
                Founders aged {eligibility.ageRange} on {event.date}.
              </>,
              <>
                Ventures at any stage —{" "}
                {eligibility.stages.join(", ").toLowerCase()}.
              </>,
              <>
                Valid identification: a South African ID number, or a passport
                if you are living in South Africa lawfully on a visa or
                permit. We check it when you apply.
              </>,
              <>
                A venture you can describe and pitch. A trading name is enough;
                a registered company name is not required.
              </>,
            ]}
          />
          <p className="rounded-xl border border-border bg-white p-5">
            <strong className="text-foreground">
              No company registration required to enter.
            </strong>{" "}
            You do not need a CIPC-registered company to apply or to reach
            the final — a trading name is enough, and selection is on merit
            alone. You do need valid identification, and you must be living in
            South Africa lawfully. Citizenship is not required: a passport
            held with a valid visa or permit is accepted. The registration
            requirement in section 7 applies only once you have won.
          </p>
          <p>
            People involved in organising, judging or mentoring the programme,
            and their immediate families, may not enter.
          </p>
        </Section>

        <Section id="entering" n={3} title="Entering">
          <p>
            Apply through this site before applications close. One application
            per venture. If you start more than one, we will treat the most
            recent submitted application as your entry.
          </p>
          <p>
            Everything you tell us must be accurate and must be your own work,
            or work you have the right to submit. Submitting someone
            else&rsquo;s venture, materials or results as your own will
            disqualify you at any stage, including after a prize is announced.
          </p>
        </Section>

        <Section id="judging" n={4} title="How entries are judged">
          <p>
            Applications are assessed on the quality of the idea, the founder,
            the traction and the pitch. Nothing else — not citizenship, not
            registration status, not where you studied.
          </p>
          <p>
            The committee scores privately and those scores and notes are
            internal. We will not share them with you or explain individual
            decisions, and the committee&rsquo;s decisions at every stage are
            final. Finalists are selected directly from the applications —
            there is no intermediate shortlist round — and the finalists pitch
            live to a judging panel at the event.
          </p>
        </Section>

        <Section id="prizes" n={5} title="Prizes">
          <p>
            A total of {prize.pool} is awarded on the day, across three places:{" "}
            {prize.tiers.map((t) => `${t.place} ${t.amount}`).join(", ")}.
          </p>
          <p>
            Prizes are grants to the winning venture, paid in South African
            rand by electronic transfer. They are not transferable and there is
            no cash alternative beyond the grant itself. You are responsible for
            any tax arising on what you receive.
          </p>
        </Section>

        <Section id="ip" n={6} title="Your idea stays yours">
          <p>
            You keep all intellectual property in your venture and in everything
            you submit. We claim no ownership of it.
          </p>
          <p>
            You give us permission to read, copy and circulate your materials
            internally for the purpose of assessing and running the programme,
            and — if you are selected as a finalist, or win — to
            use your name, your venture&rsquo;s name and a short description of
            it when we announce and report on the programme. Tell us in writing
            if you would rather we did not, and we will respect that.
          </p>
          <p className="rounded-xl border-2 border-[#ffd666] bg-[#ffd666]/15 p-5">
            <strong className="text-foreground">
              We do not sign NDAs, and you should not send us secrets.
            </strong>{" "}
            We will treat your materials as commercially sensitive within the
            committee, and we will not pass them to third parties outside the
            programme. But we cannot offer confidentiality as a guarantee: files
            you upload are stored at web addresses that anyone holding the
            address can open, as{" "}
            <Link href="/privacy#files" className="underline underline-offset-4">
              section 7 of the privacy notice
            </Link>{" "}
            explains. Pitch what you do and why it wins. Do not submit source
            code, formulas, unfiled patent detail, or anything whose value
            depends on nobody else seeing it.
          </p>
        </Section>

        <Section
          id="payment"
          n={7}
          title="The one condition, if you win"
        >
          <p>
            Before any grant is paid, a winning venture must show us that it
            is registered with CIPC — or that registration has been submitted
            and is in process, and that the person or entity receiving the
            money may lawfully do so in South Africa. If you applied on a
            passport that means a valid visa or permit. We will also need the
            banking and tax details our finance team requires.
          </p>
          <p>
            Winners have{" "}
            <strong className="text-foreground">
              {org.terms.paymentConditionWindow}
            </strong>{" "}
            to provide these. We say this up front, at the finalist stage, and
            again when winners are announced, so that nobody is surprised by it.
          </p>
          <p>
            If a winner cannot meet the condition within that window, we may
            extend it at our discretion or reallocate the grant. No formal
            identity or registration check happens at any earlier stage.
          </p>
        </Section>

        <Section id="conduct" n={8} title="Conduct">
          <p>
            We may disqualify an entry, at any stage, for dishonesty in an
            application, abuse or harassment of staff, mentors, judges or other
            participants, or attempts to interfere with the platform or the
            judging process.
          </p>
        </Section>

        <Section id="changes" n={9} title="Changes and cancellation">
          <p>
            We may change these terms, the dates, the format of the event or the
            structure of the prizes where we reasonably need to. If a change is
            significant we will email applicants and publish an updated version
            here. If circumstances beyond our control force us to postpone or
            cancel the programme, we will tell participants as soon as we can.
          </p>
        </Section>

        <Section id="liability" n={10} title="Liability">
          <p>
            Taking part is at your own initiative. To the extent the law allows,
            we are not liable for indirect or consequential loss arising from
            your participation, from a decision not to select you, or from any
            interruption to this platform. Nothing here limits liability that
            cannot lawfully be limited, including for death or personal injury
            caused by negligence, or for fraud.
          </p>
        </Section>

        <Section id="law" n={11} title="Governing law">
          <p>
            These terms are governed by {org.terms.governingLaw}, and the South
            African courts have jurisdiction over any dispute arising from them.
          </p>
        </Section>

        <Section id="contact" n={12} title="Contact">
          <p>
            Questions about these terms: <Pending value={org.generalEmail} />.
            Questions about your personal information go to our Information
            Officer at <Pending value={org.informationOfficer.email} />, and are
            covered by the{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              privacy notice
            </Link>
            .
          </p>
        </Section>
      </div>

      <p className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
        <Link href="/apply" className="underline underline-offset-4">
          Back to the application
        </Link>
      </p>
    </article>
  );
}

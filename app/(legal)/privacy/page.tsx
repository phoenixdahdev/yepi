import type { Metadata } from "next";
import Link from "next/link";
import {
  POLICY_VERSION,
  organisation as org,
  regulator,
} from "../../_content/organisation";
import { programme } from "../../_content/programme";
import { Bullets, Pending, Section } from "../_components/prose";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${programme.name} collects, uses and protects your personal information, in line with POPIA.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article>
      <p className="type-label text-blue">Privacy</p>
      <h1 className="type-display mt-4 text-h2">
        How we handle your information
      </h1>
      <p className="mt-5 max-w-xl text-body text-muted-foreground">
        This notice explains what {programme.name} collects when you apply, why
        we need it, who can see it, and what you can ask us to do with it. It is
        written to meet the Protection of Personal Information Act 4 of 2013
        (POPIA).
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Version {POLICY_VERSION} · In effect from {org.effectiveDate}. When you
        submit an application we record which version you agreed to.
      </p>

      <div className="mt-14 space-y-10">
        <Section id="who" n={1} title="Who is responsible for your information">
          <p>
            The responsible party is{" "}
            <strong className="text-foreground">
              <Pending value={org.legalName} />
            </strong>
            , registration number <Pending value={org.registrationNumber} />, at{" "}
            <Pending value={org.address} />. We run {programme.fullName} (
            {programme.name}), the entrepreneurship track of the{" "}
            {programme.parent}.
          </p>
          <p>
            Our Information Officer is <Pending value={org.informationOfficer.name} />
            , reachable at <Pending value={org.informationOfficer.email} />.
          </p>
        </Section>

        <Section id="collect" n={2} title="What we collect">
          <p>Depending on how far your application goes, we collect:</p>
          <Bullets
            items={[
              <>
                <strong className="text-foreground">About you:</strong> your
                full name, date of birth, email address and mobile number. A
                link to a professional profile if you choose to give one.
              </>,
              <>
                <strong className="text-foreground">
                  Your South African ID number:
                </strong>{" "}
                required to apply. We use it to confirm you are eligible and to
                check that the date of birth you gave matches it. An ID number
                also indicates whether you are a citizen or a permanent
                resident; we do not ask you to state that separately, and we do
                not use it to rank or score your application.
              </>,
              <>
                <strong className="text-foreground">Your venture:</strong> its
                name, what it does, where it operates, its stage, any website or
                social links, and optionally whether it is CIPC-registered —
                again, for information only, never for scoring or exclusion.
              </>,
              <>
                <strong className="text-foreground">Traction:</strong> how long
                you have been going, what progress you have made, and how many
                people are involved.
              </>,
              <>
                <strong className="text-foreground">Your pitch:</strong> your
                executive summary, your elevator pitch, your pitch deck, and any
                supporting documents you attach.
              </>,
              <>
                <strong className="text-foreground">Your consent record:</strong>{" "}
                which confirmations you ticked, when, and the version of this
                notice in force at the time.
              </>,
              <>
                <strong className="text-foreground">
                  Assessment notes (about you, not from you):
                </strong>{" "}
                private scores and notes the committee records. These are never
                shown to applicants.
              </>,
            ]}
          />
          <p className="rounded-xl border border-border bg-white p-5">
            <strong className="text-foreground">
              What we do not ask for.
            </strong>{" "}
            Applying requires your ID number and nothing else of that kind. We
            do not ask for a passport number, a CIPC registration number, or
            banking details at any point in applying or becoming a finalist.
            Those are only requested from winners, at the moment a grant is
            about to be paid.
          </p>
        </Section>

        <Section id="winners" n={3} title="If you are selected to receive a grant">
          <p>
            This is the stage where further documents are needed, because
            money is about to move. Before a grant is paid we will ask for
            proof that the venture is CIPC-registered (or that registration is
            in process), and the banking and tax details our finance team
            requires. Because applying already requires a South African ID, we
            do not need separate proof that you may lawfully receive funds
            here.
          </p>
          <p>
            We ask for these only from people who have been selected, only once
            they have been selected, and only to make the payment and meet our
            legal and banking obligations.
          </p>
        </Section>

        <Section id="why" n={4} title="Why we process it, and on what basis">
          <Bullets
            items={[
              <>
                <strong className="text-foreground">Your consent</strong>{" "}
                (section 11(1)(a)) — to receive, read and assess your
                application, and to contact you about it. You may withdraw
                consent at any time, though we cannot un-assess an application
                already judged.
              </>,
              <>
                <strong className="text-foreground">
                  Performing an agreement
                </strong>{" "}
                (section 11(1)(b)) — to pay a grant to a selected venture.
              </>,
              <>
                <strong className="text-foreground">Legal obligation</strong>{" "}
                (section 11(1)(c)) — to keep financial records and satisfy
                banking and tax requirements for funds we disburse.
              </>,
              <>
                <strong className="text-foreground">
                  Our legitimate interests
                </strong>{" "}
                (section 11(1)(f)) — to run the programme, prevent abuse of the
                application process, and keep the platform working.
              </>,
            ]}
          />
          <p>
            We do not sell your information, and we do not use it to advertise
            to you or profile you for anyone else.
          </p>
        </Section>

        <Section id="who-sees" n={5} title="Who can see it">
          <p>
            Inside the programme: the organising committee, and the mentors and
            judges involved in the stage your application has reached. Finance
            and compliance staff see payment documents only, and only for
            winners.
          </p>
          <p>
            Outside the programme, we use service providers (operators, in
            POPIA&rsquo;s language) who process information on our instructions
            and may not use it for their own purposes:
          </p>
          <Bullets
            items={[
              <>
                <strong className="text-foreground">MongoDB Atlas</strong> —
                stores the application database.
              </>,
              <>
                <strong className="text-foreground">Vercel</strong> — hosts the
                platform and stores uploaded files.
              </>,
              <>
                <strong className="text-foreground">Resend</strong> — delivers
                the emails we send you.
              </>,
            ]}
          />
        </Section>

        <Section
          id="transfers"
          n={6}
          title="Where it is stored, and transfers outside South Africa"
        >
          <p>
            Our database is hosted in{" "}
            <Pending value={org.processing.databaseRegion} />, and files and
            email are handled by providers that operate internationally. This
            means your personal information is transferred outside South Africa.
          </p>
          <p>
            Section 72 of POPIA allows this where the recipient is subject to
            laws or binding agreements that give comparable protection, or where
            the transfer is necessary to perform our agreement with you. We rely
            on the data-processing terms we have with these providers. You may
            ask us for details of those safeguards.
          </p>
        </Section>

        <Section id="files" n={7} title="Files you upload">
          <p className="rounded-xl border-2 border-[#ffd666] bg-[#ffd666]/15 p-5">
            Please read this before attaching a pitch deck. Uploaded files are
            stored in Vercel Blob and each one is given a web address containing
            a long random string. The address is not listed anywhere, not
            searchable, and not guessable in practice — but{" "}
            <strong className="text-foreground">
              anyone who has that address can open the file without signing in
            </strong>
            , and the address keeps working for as long as the file exists. If a
            document is too sensitive to be handled on that basis, do not upload
            it. Send only what the committee needs to judge your pitch.
          </p>
          <p>
            When we delete a file under our retention rules, its address stops
            working.
          </p>
        </Section>

        <Section id="cookies" n={8} title="Cookies">
          <p>
            We set two cookies, both strictly functional. Neither tracks you,
            and we run no advertising or analytics cookies.
          </p>
          <Bullets
            items={[
              <>
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                  yepi_draft
                </code>{" "}
                — links your browser to your unfinished application so you can
                come back to it. Expires after 30 days.
              </>,
              <>
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                  yepi_status
                </code>{" "}
                — keeps you signed in to your status page after you follow an
                emailed link. Expires after 30 days.
              </>,
            ]}
          />
          <p>
            Both are cryptographically signed, marked HttpOnly so page scripts
            cannot read them, and contain only a reference to your application —
            never your name, your answers or your files.
          </p>
        </Section>

        <Section id="retention" n={9} title="How long we keep it">
          <Bullets
            items={[
              <>
                <strong className="text-foreground">
                  Applications you started but never submitted:
                </strong>{" "}
                {org.retention.abandonedDraft}.
              </>,
              <>
                <strong className="text-foreground">
                  Applications that were not selected:
                </strong>{" "}
                {org.retention.unsuccessful}.
              </>,
              <>
                <strong className="text-foreground">
                  Applications that received funding:
                </strong>{" "}
                {org.retention.funded}.
              </>,
            ]}
          />
          <p>
            After that we delete the record and the uploaded files. We may keep
            anonymous, aggregated figures — how many people applied, from which
            provinces — which cannot be traced back to you.
          </p>
        </Section>

        <Section id="rights" n={10} title="Your rights">
          <p>Under POPIA you may:</p>
          <Bullets
            items={[
              <>
                Ask whether we hold information about you, and get a copy
                (sections 23 and 24).
              </>,
              <>Ask us to correct anything that is wrong or incomplete.</>,
              <>
                Ask us to delete information we no longer have a reason to keep.
              </>,
              <>
                Object to processing based on our legitimate interests (section
                11(3)).
              </>,
              <>
                Withdraw your consent, which stops any further processing that
                relied on it.
              </>,
              <>
                Complain to us, or directly to the {regulator.name}.
              </>,
            ]}
          />
          <p>
            Write to our Information Officer at{" "}
            <Pending value={org.informationOfficer.email} />. We will respond
            within a reasonable time, and we will not charge you to make a
            request or penalise you for making one.
          </p>
          <p>
            Withdrawing consent or asking us to delete your application while
            the programme is running will end your participation, because we
            cannot assess a pitch we no longer hold.
          </p>
        </Section>

        <Section id="security" n={11} title="How we protect it">
          <p>
            Traffic to and from the platform is encrypted in transit. Session
            cookies are signed and HttpOnly. Uploads are accepted only from a
            live application session, only into that application&rsquo;s own
            area, and only within set file-type and size limits. Access to
            applications is limited to the people running the programme.
          </p>
          <p>
            No system is perfectly secure. If a breach puts your personal
            information at real risk, we will notify you and the {regulator.name}{" "}
            as section 22 requires.
          </p>
        </Section>

        <Section id="children" n={12} title="Children">
          <p>
            {programme.name} is open to founders aged{" "}
            {programme.eligibility.ageRange}. We do not knowingly process the
            personal information of anyone under 18. If you believe a child has
            applied, tell us and we will delete the record.
          </p>
        </Section>

        <Section id="changes" n={13} title="Changes to this notice">
          <p>
            If we change how we handle your information we will publish an
            updated notice with a new version number here, and tell applicants
            by email where the change is significant. The version recorded
            against your application is the one you agreed to.
          </p>
        </Section>

        <Section id="contact" n={14} title="Contact us">
          <p>
            For anything in this notice, write to our Information Officer at{" "}
            <Pending value={org.informationOfficer.email} />, or to the
            programme at <Pending value={org.generalEmail} />.
          </p>
          <p>
            If you are not satisfied with our response you may complain to the{" "}
            {regulator.name} at{" "}
            <a
              href={regulator.website}
              className="underline underline-offset-4"
              rel="noreferrer"
            >
              inforegulator.org.za
            </a>
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

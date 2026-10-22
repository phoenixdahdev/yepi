import Link from "next/link";
import { ConvergingPaths } from "./_components/converging-paths";
import { Deadline } from "./_components/deadline";
import { PortraitFrame } from "./_components/portrait-frame";
import { Reveal } from "./_components/reveal";
import { RiseArrow } from "./_components/rise-arrow";
import { SmoothScroll } from "./_components/smooth-scroll";
import { YepiEndorsed, YepiLockup } from "./_components/yepi-mark";
import { programme } from "./_content/programme";
import { mentors, portraits, voices } from "./_content/people";
import { organisation as org } from "./_content/organisation";
import { siteUrl } from "./_lib/site";

const { event, prize, eligibility } = programme;

export const metadata = {
  alternates: { canonical: "/" },
};

/**
 * Event structured data, so search engines can show the date, place and
 * entry terms directly. Every field is a fact we actually hold — the
 * organiser is only named once a real legal name has been supplied, since
 * emitting a TODO into structured data would publish a placeholder as truth.
 */
function EventJsonLd() {
  const named = !org.legalName.startsWith("TODO");

  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${programme.name} — ${programme.fullName}`,
    description: `${prize.pool} awarded to young founders aged ${eligibility.ageRange}. Open to anyone living lawfully in South Africa. Valid ID required; a registered company is not.`,
    startDate: event.iso,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: siteUrl("/"),
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Johannesburg",
        addressCountry: "ZA",
      },
    },
    superEvent: { "@type": "Event", name: programme.parent },
    ...(named
      ? { organizer: { "@type": "Organization", name: org.legalName } }
      : {}),
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "ZAR",
      availability: "https://schema.org/InStock",
      url: siteUrl("/apply"),
      validFrom: "2026-10-02T00:00:00+02:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Guideline §05 — blue · white · mint. Always sits above the footer. */
function LaneRule() {
  return (
    <div className="flex h-1.5" aria-hidden="true">
      <div className="flex-1 bg-blue" />
      <div className="w-6 bg-white" />
      <div className="flex-1 bg-mint" />
    </div>
  );
}

function ApplyButton({
  tone = "mint",
  children = "Apply now",
}: {
  tone?: "mint" | "navy";
  children?: string;
}) {
  const skin =
    tone === "mint"
      ? "bg-mint text-navy hover:bg-white"
      : "bg-navy text-white hover:bg-blue";

  return (
    <Link
      href="/apply"
      className={`type-label inline-flex items-center gap-3 rounded-full px-8 py-4 transition-colors duration-200 ease-rise ${skin}`}
    >
      {children}
      <span aria-hidden="true">↑</span>
    </Link>
  );
}

/** Every section shares one centred measure, so nothing leans off-axis. */
function Band({
  tone,
  children,
  className,
}: {
  tone: "navy" | "mist" | "white" | "mint";
  children: React.ReactNode;
  className?: string;
}) {
  const skin = {
    navy: "bg-navy text-white",
    mist: "bg-mist text-navy",
    white: "bg-white text-navy",
    mint: "bg-mint text-navy",
  }[tone];

  return (
    <section className={`${skin} ${className ?? ""}`}>
      <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:py-32">
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children, tone = "blue" }: { children: string; tone?: "blue" | "mint" }) {
  return (
    <p className={`type-label ${tone === "mint" ? "text-mint" : "text-blue"}`}>
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <SmoothScroll>
      <EventJsonLd />
      {/* ---------------- Hero ---------------- */}
      <header className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex justify-center">
            <YepiLockup tone="reversed" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-20 pt-8 text-center lg:pb-24">
          <p
            className="type-label hero-line text-mint"
            style={{ transitionDelay: "100ms" }}
          >
            Applications are open · Ages {eligibility.ageRange}
          </p>

          <h1
            className="type-display hero-line mx-auto mt-7 max-w-4xl text-display"
            style={{ transitionDelay: "180ms" }}
          >
            {prize.pool} for young founders.
          </h1>

          <p
            className="hero-line mx-auto mt-7 max-w-xl text-body text-white/80"
            style={{ transitionDelay: "280ms" }}
          >
            Entrepreneurs apply, finalists are selected on merit, mentored
            and rehearsed, then pitch live to a judging panel on Conference
            Day, with grants awarded on the spot.
          </p>

          <div
            className="hero-line mt-10 flex flex-col items-center gap-5"
            style={{ transitionDelay: "380ms" }}
          >
            <ApplyButton />
            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">{event.date}</span> ·{" "}
              {event.location} ·{" "}
              <span className="font-semibold text-mint">
                <Deadline
                  opensIso={programme.applications.opensIso}
                  closesIso={programme.applications.closesIso}
                  opensLabel={programme.applications.opens}
                  // True for the whole open window, so the static shell a
                  // crawler sees is never a stale announcement.
                  fallback="Applications are open"
                />
              </span>
            </p>
          </div>

          {/* The people this is for, before anything else about the money. */}
          <div
            className="hero-line mx-auto mt-16 grid max-w-3xl grid-cols-4 gap-4 sm:gap-6"
            style={{ transitionDelay: "480ms" }}
          >
            {portraits.map((p, i) => (
              // Decorative: the surrounding copy carries the meaning, and
              // these people are not participants.
              <PortraitFrame
                key={p.photo ?? i}
                photo={p.photo}
                alt=""
                tone={(i % 3) as 0 | 1 | 2}
              />
            ))}
          </div>
        </div>
      </header>

      <main>
        {/* ---------------- Who it's for ---------------- */}
        <Band tone="mist">
          <Reveal>
            <Eyebrow>Who it&rsquo;s for</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="type-display mx-auto mt-5 max-w-3xl text-h2">
              Young founders with something already moving.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-xl text-body text-navy/70">
              You do not need a finished company, a polished deck, or a track
              record. You need an idea worth backing and evidence you have
              started.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: `Aged ${eligibility.ageRange}`,
                body: "On the day of the final, in Johannesburg.",
                tone: "blue",
              },
              {
                title: "Any stage",
                body: eligibility.stages.join(" · "),
                tone: "mint",
              },
              {
                title: "SA ID or passport",
                body: "Open to anyone living lawfully in South Africa, not only citizens.",
                tone: "navy",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={160 + i * 70} className="h-full">
                <div className="flex h-full flex-col rounded-2xl bg-white p-7">
                  <div
                    className="mx-auto h-1 w-12"
                    style={{ background: `var(--color-${card.tone})` }}
                  />
                  <h3 className="type-heading mt-5 text-xl">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-navy/65">
                    {card.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Band>

        {/* ---------------- The barrier we removed ---------------- */}
        <Band tone="navy">
          <Reveal>
            <Eyebrow tone="mint">What you need</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="type-display mx-auto mt-5 max-w-3xl text-h2">
              No company. No CIPC. Just valid ID.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-2xl text-body text-white/80">
              Selection is on the strength of the idea, the founder, the
              traction and the pitch. You do not need a registered company to
              enter — a trading name is enough. You do need valid
              identification: a South African ID, or a passport if you are
              living here lawfully on a visa or permit.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-white/55">
              Before a grant is paid, winners must also show the venture is
              CIPC-registered — or that registration is in process — and that
              they can lawfully receive funds in South Africa. Winners get 60
              days after the event to arrange that. Nothing beyond your ID is
              checked when you apply.
            </p>
          </Reveal>
        </Band>

        {/* ---------------- How it works ---------------- */}
        <Band tone="white">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="type-display mx-auto mt-5 max-w-3xl text-h2">
              Apply. Get mentored. Pitch live. Get funded.
            </h2>
          </Reveal>

          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {programme.steps.map((step, i) => (
              <Reveal key={step.label} delay={100 + i * 70} className="h-full">
                <li className="flex h-full flex-col items-center">
                  <RiseArrow
                    tone={i % 2 === 0 ? "blue" : "mint"}
                    className="h-14 w-5"
                  />
                  <p className="type-label mt-5 text-navy/40">0{i + 1}</p>
                  <h3 className="type-heading mt-2 text-xl">{step.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-navy/65">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Band>

        {/* ---------------- Prize — the converging paths play here ------- */}
        {/* Guideline §05 — the two bands at large scale, cropped by the frame.
            Given its own full-bleed stage rather than washed out behind text,
            and played on scroll so it lands as you arrive. */}
        <div className="flex h-[clamp(18rem,38vw,32rem)] items-stretch justify-center overflow-hidden bg-navy">
          <ConvergingPaths fit="meet" className="h-full" />
        </div>

        <section className="bg-navy text-white">
          <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 text-center lg:pb-32">
            <Reveal>
              <Eyebrow tone="mint">What you can win</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="type-display mx-auto mt-5 max-w-3xl text-display">
                {prize.pool}
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mx-auto mt-5 max-w-xl text-body text-white/75">
                Awarded on the day, across three places, straight to the
                venture.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {prize.tiers.map((tier, i) => {
                const skin = [
                  "bg-mint text-navy",
                  "bg-blue text-white",
                  "bg-white text-navy",
                ][i];
                return (
                  <Reveal key={tier.place} delay={160 + i * 80} className="h-full">
                    <div
                      className={`flex h-full flex-col justify-center rounded-2xl px-6 py-10 ${skin}`}
                    >
                      <p className="type-label opacity-70">{tier.place} place</p>
                      <p className="type-display mt-3 text-3xl">{tier.amount}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- Mentors — only when there are real ones ------ */}
        {mentors.length > 0 ? (
          <Band tone="mist">
            <Reveal>
              <Eyebrow>Who backs you</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="type-display mx-auto mt-5 max-w-3xl text-h2">
                Mentored by people who&rsquo;ve built before.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {mentors.map((person, i) => (
                <Reveal key={person.name} delay={100 + i * 60}>
                  <PortraitFrame
                    photo={person.photo}
                    alt={person.name}
                    tone={(i % 3) as 0 | 1 | 2}
                  />
                  <h3 className="type-heading mt-4 text-base">{person.name}</h3>
                  <p className="mt-1 text-sm text-navy/60">{person.role}</p>
                </Reveal>
              ))}
            </div>
          </Band>
        ) : null}

        {/* ---------------- Voices — only when real and consented -------- */}
        {voices.length > 0 ? (
          <Band tone="white">
            <div className="space-y-16">
              {voices.map((voice, i) => (
                <Reveal key={voice.name} delay={i * 80}>
                  <figure className="mx-auto max-w-3xl">
                    <PortraitFrame
                      photo={voice.photo}
                      alt={voice.name}
                      tone={(i % 3) as 0 | 1 | 2}
                      className="mx-auto w-28"
                    />
                    <blockquote className="type-heading mt-7 text-h2 leading-tight">
                      &ldquo;{voice.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 text-sm text-navy/60">
                      <span className="font-semibold text-navy">
                        {voice.name}
                      </span>{" "}
                      · {voice.role}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Band>
        ) : null}

        {/* ---------------- Key dates ---------------- */}
        <Band tone="mist">
          <Reveal>
            <Eyebrow>Key dates</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="type-display mx-auto mt-5 max-w-3xl text-h2">
              The run to Conference Day.
            </h2>
          </Reveal>

          <dl className="mx-auto mt-12 max-w-2xl divide-y divide-navy/10 border-y border-navy/10 text-left">
            {programme.dates.map((date, i) => (
              <Reveal key={date.label} delay={100 + i * 50}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                  <dt className="type-label text-navy/55">{date.label}</dt>
                  <dd
                    className={
                      date.status === "tbc"
                        ? "text-body text-navy/40"
                        : "text-body font-semibold"
                    }
                  >
                    {date.status === "tbc" ? "To be announced" : date.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Band>

        {/* ---------------- Closing ---------------- */}
        <Band tone="mint">
          <Reveal>
            <h2 className="type-display mx-auto max-w-3xl text-display">
              {programme.tagline}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mx-auto mt-6 max-w-md text-body text-navy/70">
              Applications are open. It takes one sitting, and no documents you
              don&rsquo;t already have.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-10 flex justify-center">
              <ApplyButton tone="navy" />
            </div>
          </Reveal>
        </Band>
      </main>

      <LaneRule />

      <footer className="bg-navy text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-14 text-center">
          {/* The pack requires an endorsed lockup on external comms. */}
          <YepiEndorsed className="h-16 w-auto max-w-full" />
          <p className="text-xs text-white/45">
            {event.location} · {event.date} ·{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>
          </p>
        </div>
      </footer>
    </SmoothScroll>
  );
}

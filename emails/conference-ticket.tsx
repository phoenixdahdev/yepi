import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";
import { programme } from "../app/_content/programme";

const NAVY = "#0b1f4f";
const BLUE = "#1769ff";
const MINT = "#1de59a";
const MIST = "#eef2f8";

export type ConferenceTicketProps = {
  /** Used for the greeting; falls back to a neutral one when absent. */
  firstName?: string;
  /** Absolute origin for images — email clients cannot resolve relative paths. */
  baseUrl?: string;
  /**
   * Draft entries never reached the panel, so they must not be thanked for
   * submitting. Same gift, honest wording.
   */
  variant?: "submitted" | "draft";
};

const { conference, event, prize } = programme;

const STEPS = [
  <>
    Open the{" "}
    <Link href={conference.ticketUrl} className="font-bold text-[#1769ff] underline">
      Quicket booking page
    </Link>
    .
  </>,
  <>
    Select <strong>{conference.ticketType}</strong>.
  </>,
  <>
    Enter the discount code <strong>{conference.discountCode}</strong>.
  </>,
  <>Complete your details and confirm your booking.</>,
];

/** Images must be absolute and publicly reachable, or they arrive broken. */
const DEFAULT_BASE_URL = process.env.SITE_URL?.startsWith("https://")
  ? process.env.SITE_URL.replace(/\/$/, "")
  : "https://yepi.info";

export function ConferenceTicket({
  firstName,
  baseUrl = DEFAULT_BASE_URL,
  variant = "submitted",
}: ConferenceTicketProps) {
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const submitted = variant === "submitted";

  return (
    <Html lang="en-ZA">
      <Head />
      <Preview>
        Your complimentary {conference.ticketType} for the {conference.name}
      </Preview>
      <Tailwind
        config={{
          // Email clients are inconsistent with rem; this pins sizing to 16px.
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: { navy: NAVY, blue: BLUE, mint: MINT, mist: MIST },
              fontFamily: {
                sans: ["Archivo", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
              },
            },
          },
        }}
      >
        <Body className="bg-mist font-sans text-navy m-0 p-0">
          <Container className="mx-auto w-full max-w-[600px] p-0">
            {/* Header */}
            <Section className="bg-navy px-10 py-8 text-center">
              <Img
                src={`${baseUrl}/brand/yepi-horizontal-reversed-960.png`}
                alt="YEPI — Young Entrepreneurs Pitch Initiative"
                width="180"
                className="mx-auto"
              />
            </Section>

            {/* Thanks */}
            <Section className="bg-white px-10 pt-10 pb-2">
              <Heading className="m-0 text-[28px] font-black leading-[1.15] text-navy">
                {submitted
                  ? "Thank you for entering YEPI."
                  : "Thank you for starting your YEPI entry."}
              </Heading>
              <Text className="mt-5 mb-0 text-[16px] leading-[26px] text-navy">
                {greeting}
              </Text>
              <Text className="mt-4 mb-0 text-[16px] leading-[26px] text-navy">
                {submitted ? (
                  <>
                    Applications for the Young Entrepreneurs Pitch Initiative
                    have closed, and we are grateful you put your venture
                    forward. It takes something to write your idea down and hand
                    it to a panel.
                  </>
                ) : (
                  <>
                    Applications for the Young Entrepreneurs Pitch Initiative
                    have closed. You started an entry this round, which means
                    you were weighing something up — and that is further than
                    most people get.
                  </>
                )}
              </Text>
              <Text className="mt-4 mb-0 text-[16px] leading-[26px] text-navy">
                {submitted
                  ? "Whatever the outcome, we would like you in the room."
                  : "Whatever happens next for your idea, we would like you in the room."}
              </Text>
            </Section>

            {/* The offer */}
            <Section className="bg-white px-10 pt-8 pb-2">
              <Section className="rounded-[16px] bg-mist p-8">
                <Text className="m-0 text-[12px] font-bold uppercase tracking-[2px] text-blue">
                  Our gift to you
                </Text>
                <Heading
                  as="h2"
                  className="mt-3 mb-0 text-[22px] font-black leading-[1.25] text-navy"
                >
                  A complimentary {conference.ticketType} to the {conference.name}.
                </Heading>
                <Text className="mt-4 mb-0 text-[15px] leading-[24px] text-navy">
                  {event.date} · {event.location} — the day {prize.pool} is
                  awarded to the finalists, live on stage.
                </Text>

                <Section className="mt-6 rounded-[12px] bg-navy px-6 py-5 text-center">
                  <Text className="m-0 text-[12px] font-bold uppercase tracking-[2px] text-mint">
                    Discount code
                  </Text>
                  <Text className="mt-2 mb-0 text-[30px] font-black tracking-[4px] text-white">
                    {conference.discountCode}
                  </Text>
                </Section>
              </Section>
            </Section>

            {/* How to claim */}
            <Section className="bg-white px-10 pt-8 pb-2">
              <Text className="m-0 text-[12px] font-bold uppercase tracking-[2px] text-blue">
                How to claim it
              </Text>
              {STEPS.map((step, i) => (
                <Section key={i} className="mt-4">
                  <table cellPadding={0} cellSpacing={0} role="presentation">
                    <tr>
                      <td className="w-[34px] align-top">
                        <Text className="m-0 text-[16px] font-black leading-[26px] text-mint">
                          {i + 1}.
                        </Text>
                      </td>
                      <td className="align-top">
                        <Text className="m-0 text-[16px] leading-[26px] text-navy">
                          {step}
                        </Text>
                      </td>
                    </tr>
                  </table>
                </Section>
              ))}

              <Section className="mt-8 text-center">
                <Link
                  href={conference.ticketUrl}
                  className="inline-block rounded-[999px] bg-mint px-8 py-4 text-[14px] font-black uppercase tracking-[2px] text-navy no-underline"
                >
                  Claim my ticket
                </Link>
              </Section>

              <Text className="mt-6 mb-0 text-[13px] leading-[21px] text-navy opacity-60">
                Tickets are limited and available while the complimentary
                allocation lasts. One ticket per person, on {conference.ticketType}s
                only.
              </Text>
            </Section>

            {/* Lane rule — guideline §05. Built from table cells with
                background colours rather than a bordered <hr>, because
                border colours do not inline reliably across mail clients. */}
            <Section className="bg-white px-10 pt-8">
              <table
                role="presentation"
                cellPadding={0}
                cellSpacing={0}
                width="100%"
                style={{ borderCollapse: "collapse" }}
              >
                <tr>
                  <td height="6" style={{ backgroundColor: BLUE, fontSize: 0, lineHeight: 0 }}>
                    &nbsp;
                  </td>
                  <td width="24" height="6" style={{ backgroundColor: "#ffffff", fontSize: 0, lineHeight: 0 }}>
                    &nbsp;
                  </td>
                  <td height="6" style={{ backgroundColor: MINT, fontSize: 0, lineHeight: 0 }}>
                    &nbsp;
                  </td>
                </tr>
              </table>
            </Section>

            {/* Footer */}
            <Section className="bg-navy px-10 py-8 text-center">
              <Img
                src={`${baseUrl}/brand/yepi-endorsement-white-960.png`}
                alt={`A programme of the ${conference.name}`}
                width="190"
                className="mx-auto"
              />
              <Text className="mt-5 mb-0 text-[12px] leading-[20px] text-white opacity-60">
                {event.date} · {event.location}
              </Text>
              <Text className="mt-3 mb-0 text-[12px] leading-[20px] text-white opacity-60">
                You are receiving this because you{" "}
                {submitted ? "applied to" : "started an application to"} YEPI.{" "}
                <Link
                  href={`${baseUrl}/privacy`}
                  className="text-white underline opacity-80"
                >
                  How we handle your information
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ConferenceTicket;

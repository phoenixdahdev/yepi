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

export type FinalistProps = {
  /** Greeting name — the founder, not the business. */
  firstName?: string;
  /** The venture as it was entered, shown back to them verbatim. */
  businessName: string;
  /**
   * One code per finalist (YEPIFINAL1…4). Required with no default: a shared
   * or missing code is the one mistake this email cannot survive, so it must
   * fail at the call site rather than quietly send the wrong one.
   */
  code: string;
  /** Absolute origin for images — email clients cannot resolve relative paths. */
  baseUrl?: string;
};

const { conference, event, prize } = programme;

/** Images must be absolute and publicly reachable, or they arrive broken. */
const DEFAULT_BASE_URL = process.env.SITE_URL?.startsWith("https://")
  ? process.env.SITE_URL.replace(/\/$/, "")
  : "https://yepi.info";

export function Finalist({
  firstName,
  businessName,
  code,
  baseUrl = DEFAULT_BASE_URL,
}: FinalistProps) {
  const greeting = firstName ? `Dear ${firstName},` : "Dear Finalist,";

  const steps = [
    <>
      Open the{" "}
      <Link href={conference.ticketUrl} className="font-bold text-[#1769ff] underline">
        Quicket booking page
      </Link>
      .
    </>,
    <>
      Select the <strong>{conference.finalistTicketType}</strong>.
    </>,
    <>
      Enter the code <strong>{code}</strong> at checkout.
    </>,
    <>Complete your details and confirm your booking.</>,
  ];

  return (
    <Html lang="en-ZA">
      <Head />
      <Preview>
        {businessName} is a YEPI 2026 finalist — your VIP ticket is inside
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

            {/* The news */}
            <Section className="bg-white px-10 pt-10 pb-2">
              <Text className="m-0 text-[12px] font-bold uppercase tracking-[2px] text-blue">
                Finalist · YEPI 2026 Awards
              </Text>
              <Heading className="mt-3 mb-0 text-[28px] font-black leading-[1.15] text-navy">
                Congratulations — you are through to the final.
              </Heading>
              <Text className="mt-5 mb-0 text-[16px] leading-[26px] text-navy">
                {greeting}
              </Text>
              <Text className="mt-4 mb-0 text-[16px] leading-[26px] text-navy">
                We are delighted to let you know that{" "}
                <strong>{businessName}</strong> has been selected as a finalist
                for the YEPI 2026 Awards.
              </Text>
              <Text className="mt-4 mb-0 text-[16px] leading-[26px] text-navy">
                As a finalist, you are invited to pitch live to our panel for
                the opportunity to receive funding at the{" "}
                {conference.name}, where {prize.pool} is awarded on stage.
              </Text>
            </Section>

            {/* What happens next */}
            <Section className="bg-white px-10 pt-8 pb-2">
              <Section className="rounded-[16px] bg-mist p-8">
                <Text className="m-0 text-[12px] font-bold uppercase tracking-[2px] text-blue">
                  What happens next
                </Text>
                <Text className="mt-3 mb-0 text-[16px] leading-[26px] text-navy">
                  We will be in touch shortly with details about the pitch
                  format and schedule. Please keep an eye on your inbox, and let
                  us know if your contact details have changed.
                </Text>
                <Text className="mt-4 mb-0 text-[15px] leading-[24px] text-navy">
                  {event.date} · {event.location}
                </Text>
              </Section>
            </Section>

            {/* VIP ticket */}
            <Section className="bg-white px-10 pt-8 pb-2">
              <Text className="m-0 text-[12px] font-bold uppercase tracking-[2px] text-blue">
                Your complimentary {conference.finalistTicketType}
              </Text>
              <Text className="mt-3 mb-0 text-[16px] leading-[26px] text-navy">
                We would also like to offer you a complimentary{" "}
                {conference.finalistTicketType} for the day. This code is yours
                alone, so please do not pass it on.
              </Text>

              <Section className="mt-6 rounded-[12px] bg-navy px-6 py-5 text-center">
                <Text className="m-0 text-[12px] font-bold uppercase tracking-[2px] text-mint">
                  Your code
                </Text>
                <Text className="mt-2 mb-0 text-[30px] font-black tracking-[4px] text-white">
                  {code}
                </Text>
              </Section>

              {steps.map((step, i) => (
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
                  Claim my VIP ticket
                </Link>
              </Section>
            </Section>

            {/* Sign-off */}
            <Section className="bg-white px-10 pt-8 pb-2">
              <Text className="m-0 text-[16px] leading-[26px] text-navy">
                Congratulations again on reaching the finalist stage. We wish
                you every success in the final round.
              </Text>
              <Text className="mt-4 mb-0 text-[16px] leading-[26px] text-navy">
                Warm regards,
                <br />
                <strong>The YEPI Team</strong>
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
                You are receiving this because {businessName} reached the final
                stage of YEPI.{" "}
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

export default Finalist;

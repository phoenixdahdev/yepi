import "server-only";
import { programme } from "../_content/programme";

/**
 * Email is sent through Resend's REST API rather than its SDK, so that
 * provisioning the Vercel Resend integration is the only step needed to turn
 * it on — no code change.
 *
 * Until RESEND_API_KEY exists the message is logged instead of sent, and the
 * caller is told, so a missing key can never look like a delivered email.
 */

type Mail = {
  to: string;
  subject: string;
  body: string;
};

export type MailResult = { delivered: boolean; reason?: string };

function wrap(body: string): string {
  // Deliberately plain: inbox providers treat a first transactional send from
  // a new domain far better without heavy markup.
  return `${body}

—
${programme.name} · ${programme.fullName}
${programme.parent}
${programme.event.date}, ${programme.event.location}`;
}

export async function sendMail({ to, subject, body }: Mail): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!key || !from) {
    console.warn(
      `[mail] NOT SENT (RESEND_API_KEY/MAIL_FROM missing) → ${to}: ${subject}\n${wrap(body)}`,
    );
    return { delivered: false, reason: "mail-not-configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text: wrap(body) }),
  });

  if (!response.ok) {
    console.error(`[mail] Resend ${response.status}: ${await response.text()}`);
    return { delivered: false, reason: `resend-${response.status}` };
  }

  return { delivered: true };
}

export function resumeEmail(link: string) {
  return {
    subject: `Your ${programme.name} application — pick up where you left off`,
    body: `Thanks for starting your ${programme.name} application.

You can come back to it any time in the next 30 days using this link:

${link}

Nothing is submitted until you reach the final step and press submit.`,
  };
}

export function submittedEmail(reference: string) {
  return {
    subject: `${programme.name} application received`,
    body: `Your application has been received and is now under review.

Your reference: ${reference}

You can check your status any time at the link on the ${programme.name} site. We will email you when your status changes.

A reminder of the one condition we mention up front: if you are selected to receive a grant, we will need proof that your venture is CIPC-registered (or that registration is in process) and that you can legally receive funds in South Africa. Nothing is checked before then.`,
  };
}

export function statusLinkEmail(link: string) {
  return {
    subject: `Your ${programme.name} status link`,
    body: `Use this link to open your application status:

${link}

The link expires in 30 minutes. If you did not request it, you can ignore this email.`,
  };
}

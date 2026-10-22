import type { ApplicationStatus } from "../_lib/schemas";

/** Organiser-facing labels. Deliberately blunter than what applicants see. */
export const ADMIN_STATUS: Record<string, { label: string; tone: string }> = {
  draft: { label: "Draft — not submitted", tone: "bg-navy/10 text-navy" },
  submitted: { label: "Submitted", tone: "bg-blue text-white" },
  under_review: { label: "Under review", tone: "bg-blue/15 text-blue" },
  finalist: { label: "Finalist", tone: "bg-mint text-navy" },
  winner: { label: "Winner", tone: "bg-navy text-white" },
  waitlisted: { label: "Waitlisted", tone: "bg-[#ffd666] text-navy" },
  not_selected: { label: "Not selected", tone: "bg-navy/10 text-navy/60" },
};

/** Statuses an organiser may set. A draft becomes submitted by the
 *  applicant, never by us, so it is not in this list. */
export const SETTABLE: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "finalist",
  "winner",
  "waitlisted",
  "not_selected",
];

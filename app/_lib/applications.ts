import "server-only";
import { redirect } from "next/navigation";
import { programme } from "../_content/programme";

/**
 * Whether the window is shut, judged at request time.
 *
 * The configured flag and the close date are both honoured: the flag so the
 * state can be set deliberately, the date so forgetting to set it cannot
 * leave the form open past the deadline.
 */
export function applicationsClosedNow(now: Date = new Date()): boolean {
  if (programme.applications.closed) return true;
  return now.getTime() > new Date(programme.applications.closesIso).getTime();
}

export const CLOSED_MESSAGE =
  `Applications closed on ${programme.applications.closes}. This form is no longer accepting entries.`;

/** For the form steps. Uses the flag only, so a page can still prerender. */
export function requireApplicationsOpen(): void {
  if (programme.applications.closed) redirect("/apply/closed");
}

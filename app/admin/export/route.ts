import { currentAdmin } from "../../_lib/admin";
import { listApplications } from "../../_lib/application";
import { APPLICATION_STATUSES, type ApplicationStatus } from "../../_lib/schemas";

/**
 * Applicant text ends up in a spreadsheet, so every cell is escaped for CSV
 * and any value a spreadsheet would treat as a formula is defused with a
 * leading apostrophe. Without that, "=HYPERLINK(...)" typed into a form
 * field becomes a live formula on the reviewer's machine.
 */
function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

const HEADERS = [
  "reference", "status", "submitted", "updated",
  "full name", "id type", "id number", "passport", "passport country",
  "date of birth", "email", "mobile", "profile",
  "venture", "description", "location", "stage", "website", "cipc",
  "operating since", "progress", "team size",
  "executive summary", "elevator pitch", "pitch deck", "supporting files",
  "notes", "scores",
];

export async function GET(request: Request): Promise<Response> {
  // Never redirects: a download that silently returns a sign-in page is worse
  // than one that plainly refuses.
  if (!(await currentAdmin())) {
    return new Response("Not authorised.", { status: 401 });
  }

  const raw = new URL(request.url).searchParams.get("status") ?? undefined;
  const status = (APPLICATION_STATUSES as readonly string[]).includes(raw ?? "")
    ? (raw as ApplicationStatus)
    : undefined;

  const rows = await listApplications({ status });
  const iso = (d?: Date) => (d ? d.toISOString() : "");

  const body = [
    HEADERS.map(cell).join(","),
    ...rows.map((a) =>
      [
        a.id.slice(0, 8).toUpperCase(), a.status, iso(a.submittedAt), iso(a.updatedAt),
        a.founder?.fullName, a.founder?.idType, a.founder?.idNumber,
        a.founder?.passportNumber, a.founder?.nationality,
        a.founder?.dateOfBirth, a.founder?.email, a.founder?.mobile, a.founder?.profileUrl,
        a.venture?.ventureName, a.venture?.description, a.venture?.location,
        a.venture?.stage, a.venture?.website, a.venture?.cipcStatus,
        a.traction?.operatingSince, a.traction?.progress, a.traction?.teamSize,
        a.materials?.executiveSummary, a.materials?.elevatorPitch,
        a.materials?.pitchDeck?.url,
        a.materials?.supporting?.map((f) => f.url).join(" "),
        a.review?.notes,
        a.review?.scores
          ? Object.entries(a.review.scores).map(([k, v]) => `${k}=${v}`).join(" ")
          : "",
      ].map(cell).join(","),
    ),
  ].join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(
    // Excel reads UTF-8 correctly only with a byte-order mark; without it
    // South African names with diacritics arrive mangled.
    "﻿" + body,
    {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="yepi-applications-${status ?? "all"}-${stamp}.csv"`,
        "cache-control": "no-store",
      },
    },
  );
}

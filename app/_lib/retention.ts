import "server-only";
import { del } from "@vercel/blob";
import { applications } from "./db";
import { organisation } from "../_content/organisation";
import type { ApplicationDoc } from "./application";

/**
 * Enforces the retention periods published in the privacy notice (§9). The
 * notice is a commitment, so this has to actually run — see vercel.ts.
 *
 * Deletes the uploaded files first and the record second: a record without
 * its files is recoverable noise, whereas files whose record is gone are
 * orphaned and nothing knows to delete them later.
 */

export type RetentionReport = {
  dryRun: boolean;
  deleted: { abandonedDrafts: number; unsuccessful: number; funded: number };
  blobsDeleted: number;
  blobFailures: number;
};

const { retention } = organisation;

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function blobUrls(doc: ApplicationDoc): string[] {
  const urls: string[] = [];
  if (doc.materials?.pitchDeck?.url) urls.push(doc.materials.pitchDeck.url);
  for (const file of doc.materials?.supporting ?? []) urls.push(file.url);
  return urls;
}

export async function runRetention(
  { dryRun = false, now = new Date() }: { dryRun?: boolean; now?: Date } = {},
): Promise<RetentionReport> {
  const col = await applications();
  const programmeEnd = new Date(retention.programmeEndsAt);

  const draftCutoff = new Date(
    now.getTime() - retention.abandonedDraftDays * 24 * 60 * 60 * 1000,
  );
  const unsuccessfulCutoff = addMonths(programmeEnd, retention.unsuccessfulMonths);
  const fundedCutoff = new Date(programmeEnd);
  fundedCutoff.setFullYear(fundedCutoff.getFullYear() + retention.fundedYears);

  const buckets = {
    // Started, never submitted, untouched since the cutoff.
    abandonedDrafts:
      { status: "draft", updatedAt: { $lt: draftCutoff } } as const,
    // Everything that did not receive funding, once the programme is long over.
    unsuccessful:
      now >= unsuccessfulCutoff
        ? ({ status: { $nin: ["draft", "winner"] } } as const)
        : null,
    // Funded ventures are held longer for financial record-keeping.
    funded: now >= fundedCutoff ? ({ status: "winner" } as const) : null,
  };

  const report: RetentionReport = {
    dryRun,
    deleted: { abandonedDrafts: 0, unsuccessful: 0, funded: 0 },
    blobsDeleted: 0,
    blobFailures: 0,
  };

  for (const [bucket, filter] of Object.entries(buckets)) {
    if (!filter) continue;

    const docs = await col.find(filter).toArray();
    if (docs.length === 0) continue;

    const urls = docs.flatMap(blobUrls);

    if (!dryRun) {
      for (const url of urls) {
        try {
          await del(url);
          report.blobsDeleted += 1;
        } catch (error) {
          // A file that is already gone must not stop the record being
          // deleted, or the same batch retries forever.
          report.blobFailures += 1;
          console.error("[retention] blob delete failed", url, error);
        }
      }
      await col.deleteMany({ id: { $in: docs.map((d) => d.id) } });
    } else {
      report.blobsDeleted += urls.length;
    }

    report.deleted[bucket as keyof RetentionReport["deleted"]] = docs.length;
  }

  return report;
}

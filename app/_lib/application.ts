import "server-only";
import { applications, ensureIndexes } from "./db";
import { newId } from "./session";
import { POLICY_VERSION } from "../_content/organisation";
import type {
  FounderInput,
  MaterialsInput,
  TractionInput,
  UploadedFile,
  VentureInput,
} from "./schemas";

export * from "./schemas";

/* ------------------------------------------------------------------ *
 * Document shape
 * ------------------------------------------------------------------ */

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "finalist"
  | "winner"
  | "waitlisted"
  | "not_selected";

export type ApplicationDoc = {
  id: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  founder?: FounderInput;
  venture?: VentureInput;
  traction?: TractionInput;
  materials?: {
    executiveSummary: string;
    elevatorPitch: string;
    pitchDeck?: UploadedFile;
    supporting?: UploadedFile[];
  };
  consent?: {
    accurate: boolean;
    terms: boolean;
    popia: boolean;
    acceptedAt: Date;
    /** Which version of the notices they agreed to, for a defensible record. */
    policyVersion: string;
  };
  /** Organiser-only. Never returned by any applicant-facing query. */
  review?: {
    scores?: Record<string, number>;
    notes?: string;
  };
};

export { POLICY_VERSION } from "../_content/organisation";

/* ------------------------------------------------------------------ *
 * Data access
 * ------------------------------------------------------------------ */

export async function createDraft(founder: FounderInput): Promise<string> {
  await ensureIndexes();
  const col = await applications();
  const now = new Date();
  const id = newId();

  await col.insertOne({
    id,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    founder,
  });

  return id;
}

export async function findDraftByEmail(
  email: string,
): Promise<ApplicationDoc | null> {
  const col = await applications();
  return col.findOne({ "founder.email": email.toLowerCase(), status: "draft" });
}

export async function findById(id: string): Promise<ApplicationDoc | null> {
  const col = await applications();
  return col.findOne({ id });
}

export async function findLatestByEmail(
  email: string,
): Promise<ApplicationDoc | null> {
  const col = await applications();
  return col.findOne(
    { "founder.email": email.toLowerCase() },
    { sort: { createdAt: -1 } },
  );
}

/** Patches one section of a draft. Refuses to touch a submitted application. */
export async function patchDraft(
  id: string,
  patch: Partial<Omit<ApplicationDoc, "id" | "status" | "createdAt">>,
): Promise<boolean> {
  const col = await applications();
  const result = await col.updateOne(
    { id, status: "draft" },
    { $set: { ...patch, updatedAt: new Date() } },
  );
  return result.matchedCount === 1;
}

export async function saveMaterialsSection(
  id: string,
  input: MaterialsInput,
): Promise<boolean> {
  return patchDraft(id, {
    materials: {
      executiveSummary: input.executiveSummary,
      elevatorPitch: input.elevatorPitch,
      pitchDeck: input.pitchDeck ?? undefined,
      supporting: input.supporting,
    },
  });
}

export async function submitDraft(id: string): Promise<boolean> {
  const col = await applications();
  const now = new Date();
  const result = await col.updateOne(
    { id, status: "draft" },
    {
      $set: {
        status: "submitted",
        submittedAt: now,
        updatedAt: now,
        consent: {
          accurate: true,
          terms: true,
          popia: true,
          acceptedAt: now,
          policyVersion: POLICY_VERSION,
        },
      },
    },
  );
  return result.matchedCount === 1;
}

/* ------------------------------------------------------------------ *
 * Status, as the applicant sees it (workflow §4)
 * ------------------------------------------------------------------ */

export const STATUS_VIEW: Record<
  Exclude<ApplicationStatus, "draft">,
  {
    label: string;
    meaning: string;
    action: string | null;
    tone: "mint" | "blue" | "navy";
  }
> = {
  submitted: {
    label: "Submitted — under review",
    meaning: "Your application has been received and the committee is reviewing it.",
    action: null,
    tone: "blue",
  },
  under_review: {
    label: "Submitted — under review",
    meaning: "Your application has been received and the committee is reviewing it.",
    action: null,
    tone: "blue",
  },
  finalist: {
    label: "Finalist",
    meaning: "You have been selected for the live final.",
    action: "Follow the event instructions sent to your email.",
    tone: "mint",
  },
  winner: {
    label: "Winner — funded",
    meaning: "You have been selected to receive a grant.",
    action:
      "Complete the payment-condition documents: proof of CIPC registration (or registration in process) and proof that you can legally receive funds in South Africa.",
    tone: "mint",
  },
  waitlisted: {
    label: "Waitlisted",
    meaning: "Your application is being held pending the final selection.",
    action: null,
    tone: "navy",
  },
  not_selected: {
    label: "Not selected",
    meaning: "Your application will not progress further this year.",
    action: null,
    tone: "navy",
  },
};

import { z } from "zod";

/**
 * Shared by the browser (react-hook-form) and the server actions. No
 * "server-only" here on purpose — but the server re-validates with these
 * same schemas on every call and never trusts what the client sent.
 */

const text = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} is required.`)
    .max(max, `${label} must be under ${max} characters.`);

export const STAGES = [
  "Idea",
  "Pre-revenue",
  "Early revenue",
  "Growth",
  "Scale",
] as const;

export const CIPC_OPTIONS = ["Yes", "No", "In process", "Prefer not to say"] as const;

/**
 * Ages 18-35 (guideline §06), measured at the event date so every applicant
 * is judged against one fixed reference rather than the day they applied.
 */
export const AGE_REFERENCE = new Date("2026-12-30T00:00:00+02:00");

/** The same date in words. Kept beside AGE_REFERENCE so the rule stated in
 *  the form and the rule enforced here cannot drift apart. */
export const AGE_REFERENCE_LABEL = "30 December 2026";

export function ageAt(dob: Date, reference: Date = AGE_REFERENCE): number {
  let age = reference.getFullYear() - dob.getFullYear();
  const months = reference.getMonth() - dob.getMonth();
  if (months < 0 || (months === 0 && reference.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}


/* ------------------------------------------------------------------ *
 * South African ID number
 *
 * Format YYMMDD SSSS C A Z: date of birth, sequence (which encodes sex),
 * citizenship (0 citizen, 1 permanent resident), a legacy digit, and a Luhn
 * check digit over the whole number.
 * ------------------------------------------------------------------ */

function luhnValid(digits: string): boolean {
  let sum = 0;
  const n = digits.length;
  for (let i = 0; i < n; i++) {
    let d = Number(digits[i]);
    if ((n - 1 - i) % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export type SaId = {
  /** Date of birth encoded in the first six digits. */
  dateOfBirth: Date;
  /** Digit 11: 0 is a citizen, 1 a permanent resident. */
  citizenship: "citizen" | "permanent-resident";
};

/** Returns null when the number is not a structurally valid SA ID. */
export function parseSaId(raw: string): SaId | null {
  const id = raw.replace(/\s|-/g, "");
  if (!/^\d{13}$/.test(id)) return null;
  if (!luhnValid(id)) return null;

  const yy = Number(id.slice(0, 2));
  const mm = Number(id.slice(2, 4));
  const dd = Number(id.slice(4, 6));
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;

  // Two-digit years are ambiguous. Prefer this century, falling back to the
  // last one when that would place the birth in the future.
  let dob = new Date(Date.UTC(2000 + yy, mm - 1, dd));
  if (dob.getTime() > Date.now()) dob = new Date(Date.UTC(1900 + yy, mm - 1, dd));

  // Rejects impossible days such as 31 February, which roll over.
  if (dob.getUTCMonth() !== mm - 1 || dob.getUTCDate() !== dd) return null;

  const c = id[10];
  if (c !== "0" && c !== "1") return null;

  return {
    dateOfBirth: dob,
    citizenship: c === "0" ? "citizen" : "permanent-resident",
  };
}

export const saIdNumber = z
  .string()
  .trim()
  .min(1, "ID number is required.")
  .refine(
    (v) => /^\d{13}$/.test(v.replace(/\s|-/g, "")),
    "A South African ID number is 13 digits.",
  )
  .refine(
    (v) => parseSaId(v) !== null,
    "That ID number is not valid. Check the digits and try again.",
  );

const optionalUrl = z
  .union([z.url("Enter a valid link, including https://"), z.literal("")])
  .optional();

export const founderSchema = z
  .object({
  fullName: text(2, 120, "Full name"),
  idNumber: saIdNumber,
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date.")
    .refine((value) => {
      const age = ageAt(new Date(value));
      return age >= 18 && age <= 35;
    }, `YEPI is open to founders aged 18 to 35 on ${AGE_REFERENCE_LABEL}.`),
  email: z.email("Enter a valid email address."),
  mobile: text(6, 32, "Mobile number"),
  profileUrl: optionalUrl,
  })
  // The ID encodes a date of birth, so a mismatch means one of the two
  // fields is mistyped. Catching it here beats discovering it at payout.
  .refine(
    (v) => {
      const parsed = parseSaId(v.idNumber);
      // Each field reports its own format errors; only compare two good ones.
      if (!parsed || !/^\d{4}-\d{2}-\d{2}$/.test(v.dateOfBirth)) return true;
      // Compare as date strings: reading UTC components off one side and
      // local components off the other is off by a day west of Greenwich.
      return parsed.dateOfBirth.toISOString().slice(0, 10) === v.dateOfBirth;
    },
    {
      path: ["idNumber"],
      error:
        "This ID number carries a different date of birth to the one you chose.",
    },
  );

export const ventureSchema = z.object({
  ventureName: text(2, 120, "Venture name"),
  description: text(20, 400, "Description"),
  location: text(2, 120, "Location"),
  stage: z.enum(STAGES, { error: "Choose the stage you are at." }),
  website: optionalUrl,
  /** Informational only — never used for scoring or exclusion. */
  cipcStatus: z.enum(CIPC_OPTIONS).optional(),
});

export const tractionSchema = z.object({
  operatingSince: text(2, 120, "How long you have been going"),
  progress: text(20, 2000, "Progress so far"),
  teamSize: z.coerce
    .number<number>()
    .int("Enter a whole number.")
    .min(1, "There is at least one of you.")
    .max(1000, "Enter a realistic team size."),
});

export const uploadedFileSchema = z.object({
  url: z.string(),
  pathname: z.string(),
  filename: z.string(),
  size: z.number(),
  contentType: z.string(),
});

export const materialsSchema = z
  .object({
    executiveSummary: text(100, 5000, "Executive summary"),
    elevatorPitch: text(50, 1200, "Elevator pitch"),
    pitchDeck: uploadedFileSchema.nullable(),
    supporting: z.array(uploadedFileSchema),
  })
  .refine((value) => value.pitchDeck !== null, {
    path: ["pitchDeck"],
    error: "Attach your pitch deck to continue.",
  });

export const consentSchema = z.object({
  accurate: z.literal(true, { error: "Confirm the information is accurate." }),
  terms: z.literal(true, { error: "Accept the terms of participation." }),
  popia: z.literal(true, { error: "Give POPIA consent to continue." }),
});

export const statusRequestSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export type FounderInput = z.infer<typeof founderSchema>;
export type VentureInput = z.infer<typeof ventureSchema>;
export type TractionInput = z.infer<typeof tractionSchema>;
export type MaterialsInput = z.infer<typeof materialsSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;
export type UploadedFile = z.infer<typeof uploadedFileSchema>;

/** What every mutation returns, so the client can branch without throwing. */
export type ActionResult =
  | { ok: true; next?: string }
  | { ok: false; message?: string; errors?: Record<string, string[] | undefined> };

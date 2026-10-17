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
export const AGE_REFERENCE = new Date("2026-10-31T00:00:00+02:00");

export function ageAt(dob: Date, reference: Date = AGE_REFERENCE): number {
  let age = reference.getFullYear() - dob.getFullYear();
  const months = reference.getMonth() - dob.getMonth();
  if (months < 0 || (months === 0 && reference.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

const optionalUrl = z
  .union([z.url("Enter a valid link, including https://"), z.literal("")])
  .optional();

export const founderSchema = z.object({
  fullName: text(2, 120, "Full name"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date.")
    .refine((value) => {
      const age = ageAt(new Date(value));
      return age >= 18 && age <= 35;
    }, "YEPI is open to founders aged 18 to 35 on 31 October 2026."),
  email: z.email("Enter a valid email address."),
  mobile: text(6, 32, "Mobile number"),
  profileUrl: optionalUrl,
  /** Informational only — never used for scoring or exclusion. */
  legalStatusNote: z.string().trim().max(400).optional(),
});

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

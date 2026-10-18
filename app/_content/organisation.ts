/**
 * Legal identity behind the programme, and the choices that a privacy notice
 * has to state plainly. Everything marked TODO must be supplied before the
 * notice is published — a POPIA notice naming no responsible party and no
 * Information Officer is not a valid notice.
 */
/** Stamped into every consent record and displayed on the notice. Bump it
 *  whenever the notice changes materially. */
export const POLICY_VERSION = "2026-10-01";

export const organisation = {
  /** The responsible party under POPIA: the entity that decides why and how
   *  applicants' personal information is processed. */
  legalName: "TODO — registered legal name of the organising entity",
  registrationNumber: "TODO — company / NPO registration number",
  address: "TODO — physical address for service",

  /** POPIA requires a designated Information Officer, registered with the
   *  Information Regulator. */
  informationOfficer: {
    name: "TODO — full name",
    email: "TODO — e.g. privacy@yepi.co.za",
  },

  generalEmail: "TODO — e.g. hello@yepi.co.za",

  /** The date POLICY_VERSION took effect, shown on the notice. */
  effectiveDate: "1 October 2026",

  /** Where personal information physically lives. The database region is
   *  outside South Africa, which engages section 72. */
  processing: {
    databaseRegion: "TODO — confirm the MongoDB Atlas region (currently outside South Africa)",
    fileStorage: "Vercel Blob",
    email: "Resend",
  },

  /** Terms of participation. */
  terms: {
    /** Workflow §6: winners get a clear window to produce CIPC proof and
     *  proof they can lawfully receive funds, before any money moves. */
    paymentConditionWindow: "60 days from the date winners are announced",
    /** Pitch competitions conventionally decline NDAs, and here the file
     *  storage makes a confidentiality promise impossible to keep anyway. */
    signsNda: false,
    governingLaw: "the laws of the Republic of South Africa",
  },

  /** Retention. The prose is what the notice displays; the day counts are
   *  what the scheduled deletion actually enforces. Keep them in step. */
  retention: {
    abandonedDraft: "30 days from the last time it was saved",
    unsuccessful: "12 months after the programme concludes",
    funded: "5 years, to meet financial record-keeping obligations",

    /** The programme concludes on the event date. */
    programmeEndsAt: "2026-12-30T23:59:59+02:00",
    abandonedDraftDays: 30,
    unsuccessfulMonths: 12,
    fundedYears: 5,
  },
} as const;

/** The supervisory authority applicants may complain to. Confirm current
 *  contact details at inforegulator.org.za before publishing. */
export const regulator = {
  name: "Information Regulator (South Africa)",
  website: "https://inforegulator.org.za",
} as const;

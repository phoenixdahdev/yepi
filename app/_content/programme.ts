/**
 * Single source of truth for every programme fact on the public site.
 *
 * Sourced from "YEPI Design Guideline" (V2.0 · 2026) and
 * "Pitch_Platform_Workflow_V2". Anything marked TBC is absent from both
 * documents and needs a real value before launch.
 */

export type ProgrammeDate = {
  label: string;
  value: string;
  status: "done" | "upcoming" | "tbc";
};

/** No shortlist round: applications go straight to finalist selection. */
const dates: ProgrammeDate[] = [
    {
      label: "Applications open",
      value: "Saturday 19 December 2026",
      status: "upcoming",
    },
    {
      label: "Applications close",
      value: "Thursday 24 December 2026, midnight",
      status: "upcoming",
    },
    {
      label: "Finalists announced",
      value: "Saturday 26 December 2026",
      status: "upcoming",
    },
    {
      label: "Live pitch & awards",
      value: "Saturday 31 October 2026",
      status: "upcoming",
    },
  ];

export const programme = {
  name: "YEPI",
  fullName: "Young Entrepreneurs Pitch Initiative",
  parent: "Wisdom for Business Conference 2026",
  tagline: "Where young ideas rise.",

  /** Applications close before the final; the hero counts down to this,
   *  since it is the deadline an applicant can still act on. */
  applications: {
    opensIso: "2026-12-19T00:00:00+02:00",
    opens: "Saturday 19 December 2026",
    closesIso: "2026-12-24T23:59:59+02:00",
    closes: "Thursday 24 December 2026, midnight",
    finalistsIso: "2026-12-26T00:00:00+02:00",
    finalists: "Saturday 26 December 2026",
  },

  event: {
    /** Machine-readable, for the countdown. */
    iso: "2026-10-31T09:00:00+02:00",
    date: "Saturday 31 October 2026",
    shortDate: "31 Oct 2026",
    location: "Johannesburg, South Africa",
  },

  prize: {
    pool: "R500,000",
    tiers: [
      { place: "1st", amount: "R250,000" },
      { place: "2nd", amount: "R150,000" },
      { place: "3rd", amount: "R100,000" },
    ],
  },

  /** Guideline §06: "APPLY FROM 2 OCT · AGES 18–35". */
  eligibility: {
    ageRange: "18–35",
    stages: ["Idea", "Pre-revenue", "Early revenue", "Growth", "Scale"],
  },

  dates,

  /** Guideline §04 label specimen: APPLY → GET MENTORED → PITCH LIVE → GET FUNDED */
  steps: [
    {
      label: "Apply",
      body: "A short application about you, your venture and your traction. No company registration needed.",
    },
    {
      label: "Get mentored",
      body: "Finalists are selected on merit, then mentored and rehearsed by people who have built before.",
    },
    {
      label: "Pitch live",
      body: "Finalists pitch to a judging panel on Conference Day in Johannesburg.",
    },
    {
      label: "Get funded",
      body: "Grants are awarded on the spot, across three places.",
    },
  ],

  /** Guideline §01 — the three brand values, verbatim. */
  values: [
    {
      title: "Guided",
      body: "Mentored, rehearsed, backed by people who've built before.",
    },
    {
      title: "Ambitious",
      body: "Ventures ready to scale, with the capital to match.",
    },
    {
      title: "Upward",
      body: "Kingdom-aligned purpose. Capital as stewardship, not hype.",
    },
  ],
} as const;

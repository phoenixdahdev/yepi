/**
 * Real people only. Anything in here renders publicly on the landing page.
 *
 * 2026 is the first running of YEPI, so there are no alumni to quote. Leave
 * `voices` empty rather than inventing a founder: a fabricated testimonial on
 * a page taking real applications is not a placeholder, it is a lie.
 *
 * Sections whose array is empty are not rendered at all.
 */

export type Person = {
  name: string;
  role: string;
  /** Path under /public, e.g. "/people/ada.jpg". Omitted until a real,
   *  cleared photograph exists — the frame falls back to a brand graphic. */
  photo?: string;
};

export type Voice = {
  quote: string;
  name: string;
  role: string;
  photo?: string;
};

/** Mentors and judges. Needs real names and consent before publishing. */
export const mentors: Person[] = [];

/** Quotes from named, real people who agreed to be quoted. */
export const voices: Voice[] = [];

/**
 * Illustrative imagery only. These are stock photographs of people with no
 * connection to the programme, so they carry no names, no roles and no
 * quotes, and are marked decorative for assistive technology. See
 * public/people/ATTRIBUTION.md — they should be replaced with real South
 * African founders before launch.
 *
 * A frame with no `photo` falls back to a drawn portrait slot.
 */
export const portraits: { photo?: string }[] = [
  { photo: "/people/founder-1.jpg" },
  { photo: "/people/founder-2.jpg" },
  { photo: "/people/founder-3.jpg" },
  { photo: "/people/founder-4.jpg" },
];

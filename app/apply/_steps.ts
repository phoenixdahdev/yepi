/** Shared by server pages and client form components, so no server-only here. */
export const STEPS = [
  { path: "/apply", label: "You", eyebrow: "Step 1 of 5" },
  { path: "/apply/venture", label: "Venture", eyebrow: "Step 2 of 5" },
  { path: "/apply/traction", label: "Traction", eyebrow: "Step 3 of 5" },
  { path: "/apply/materials", label: "Materials", eyebrow: "Step 4 of 5" },
  { path: "/apply/review", label: "Review", eyebrow: "Step 5 of 5" },
] as const;

export type FormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export const EMPTY_STATE: FormState = {};

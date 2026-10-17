"use client";

import { usePathname } from "next/navigation";
import { STEPS } from "../_steps";

/**
 * The guideline's lane rule doing the job it already implies: blue for done,
 * mint for the step you are on, faint for what is ahead.
 */
export function StepProgress() {
  const pathname = usePathname();
  const current = STEPS.findIndex((step) => step.path === pathname);

  // Confirmation and resume pages sit under /apply but are not steps.
  if (current === -1) return null;

  return (
    <nav aria-label="Application progress">
      <ol className="flex gap-1.5">
        {STEPS.map((step, i) => (
          <li key={step.path} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors duration-300 ease-rise ${
                i < current ? "bg-blue" : i === current ? "bg-mint" : "bg-navy/12"
              }`}
            />
            <span
              className={`mt-2 block text-[0.7rem] font-semibold tracking-wide ${
                i === current ? "text-navy" : "text-navy/45"
              }`}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="sr-only">
        Step {current + 1} of {STEPS.length}: {STEPS[current]?.label}
      </p>
    </nav>
  );
}

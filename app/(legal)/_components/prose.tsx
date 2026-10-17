import type { ReactNode } from "react";

export function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-border pt-10">
      <h2 className="type-heading text-xl">
        <span className="mr-3 text-muted-foreground">{n}.</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-body text-foreground/80">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span
            className={`mt-2.5 h-1.5 w-5 shrink-0 ${i % 2 === 0 ? "bg-blue" : "bg-mint"}`}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Renders an unsupplied value as a visible marker rather than printing the
 * raw "TODO —" string, so an unfinished notice cannot be published quietly.
 */
export function Pending({ value }: { value: string }) {
  if (!value.startsWith("TODO")) return <>{value}</>;
  return (
    <mark className="rounded bg-[#ffd666] px-1.5 py-0.5 text-sm font-semibold text-navy">
      {value.replace(/^TODO\s*—\s*/, "To supply: ")}
    </mark>
  );
}

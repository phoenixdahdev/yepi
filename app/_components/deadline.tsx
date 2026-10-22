"use client";

import { useEffect, useState } from "react";

type Phase =
  | { kind: "unknown" }
  | { kind: "before" }
  | { kind: "open"; days: number }
  | { kind: "lastDay" }
  | { kind: "closed" };

/**
 * Counts down to the application deadline, and says so. An unlabelled
 * "N days to go" sitting beside the event date reads as a countdown to the
 * event, which is a different number and invites people to check the
 * arithmetic and find it wrong.
 *
 * Runs on the client only: reading the clock on the server would be a
 * request-time read during prerender, which Cache Components rejects and
 * which would cost the landing page its static shell. Until it mounts it
 * renders `fallback`, so there is no hydration mismatch and no layout jump —
 * which also means the fallback must be true for the whole open window,
 * since crawlers and no-JS visitors never see anything else.
 */
export function Deadline({
  opensIso,
  closesIso,
  opensLabel,
  fallback,
}: {
  opensIso: string;
  closesIso: string;
  opensLabel: string;
  fallback: string;
}) {
  const [phase, setPhase] = useState<Phase>({ kind: "unknown" });

  useEffect(() => {
    const opens = new Date(opensIso).getTime();
    const closes = new Date(closesIso).getTime();

    const tick = () => {
      const now = Date.now();
      if (now < opens) return setPhase({ kind: "before" });
      if (now > closes) return setPhase({ kind: "closed" });

      const days = Math.ceil((closes - now) / 86_400_000);
      setPhase(days <= 1 ? { kind: "lastDay" } : { kind: "open", days });
    };

    tick();
    const timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }, [opensIso, closesIso]);

  switch (phase.kind) {
    case "unknown":
      return <>{fallback}</>;
    case "before":
      return <>Opens {opensLabel}</>;
    case "lastDay":
      return <>Last day to apply</>;
    case "closed":
      return <>Applications have closed</>;
    default:
      return <>{phase.days} days left to apply</>;
  }
}

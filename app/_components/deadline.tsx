"use client";

import { useEffect, useState } from "react";

/**
 * Counts down on the client only. Computing this on the server would read the
 * clock during prerender, which Cache Components rejects and which would cost
 * the landing page its static shell. Renders the date until it mounts, so
 * there is no hydration mismatch and no layout jump.
 */
export function Deadline({ iso, fallback }: { iso: string; fallback: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(iso).getTime();
    const tick = () =>
      setDays(Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24)));
    tick();
    const timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }, [iso]);

  if (days === null) return <>{fallback}</>;
  if (days < 0) return <>Applications have closed</>;
  if (days === 0) return <>Closing today</>;
  return (
    <>
      {days} {days === 1 ? "day" : "days"} to go
    </>
  );
}

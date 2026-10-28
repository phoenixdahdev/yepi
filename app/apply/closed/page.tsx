import Link from "next/link";
import { programme } from "../../_content/programme";

export const metadata = { title: "Applications closed" };

export default function ApplicationsClosedPage() {
  const { applications, event, prize } = programme;

  return (
    <div className="py-6">
      <p className="type-label text-blue">Applications closed</p>
      <h1 className="type-display mt-4 text-h2">
        The window has shut for this year.
      </h1>

      <p className="mt-6 max-w-xl text-body text-navy/75">
        Applications closed on {applications.closes}. We are no longer
        accepting entries.
      </p>

      <div className="mt-12 rounded-2xl bg-white p-6 sm:p-8">
        <h2 className="type-heading text-xl">What happens now</h2>
        <ol className="mt-5 space-y-4 text-body text-navy/75">
          <li className="flex gap-4">
            <span className="mt-2.5 h-1.5 w-6 shrink-0 bg-blue" />
            Finalists are announced on {applications.finalists}. Everyone who
            applied hears from us either way.
          </li>
          <li className="flex gap-4">
            <span className="mt-2.5 h-1.5 w-6 shrink-0 bg-mint" />
            Finalists are mentored and rehearsed, then pitch live on{" "}
            {event.date} in {event.location}, with {prize.pool} awarded on the
            day.
          </li>
        </ol>

        <p className="mt-7 text-sm leading-6 text-navy/60">
          If you submitted an application, you can check where it stands at any
          time.
        </p>

        <div className="mt-7 flex flex-wrap gap-4">
          <Link
            href="/status"
            className="type-label inline-flex items-center gap-3 rounded-full bg-navy px-7 py-4 text-white transition-colors duration-200 ease-rise hover:bg-blue"
          >
            Check my status
            <span aria-hidden="true">↑</span>
          </Link>
          <Link
            href="/"
            className="type-label inline-flex items-center rounded-full border-2 border-navy/20 px-7 py-4 text-navy transition-colors duration-200 ease-rise hover:border-navy"
          >
            Back to {programme.name}
          </Link>
        </div>
      </div>
    </div>
  );
}

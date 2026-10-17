import Link from "next/link";
import { findById } from "../../_lib/application";
import { currentStatusId } from "../../_lib/draft-session";
import { programme } from "../../_content/programme";

export const metadata = { title: "Application received" };

export default async function SubmittedPage() {
  const id = await currentStatusId();
  let reference: string | null = null;
  let email: string | null = null;

  if (id) {
    try {
      const doc = await findById(id);
      if (doc?.status && doc.status !== "draft") {
        reference = doc.id.slice(0, 8).toUpperCase();
        email = doc.founder?.email ?? null;
      }
    } catch (error) {
      console.error("[apply] submitted", error);
    }
  }

  return (
    <div className="py-6">
      <p className="type-label text-blue">Application received</p>
      <h1 className="type-display mt-4 text-h2">That&rsquo;s in. Well done.</h1>

      <p className="mt-6 max-w-xl text-body text-navy/75">
        Your application has been received and is now under review.
        {email ? (
          <>
            {" "}
            We&rsquo;ve emailed a confirmation to{" "}
            <span className="font-semibold text-navy">{email}</span>.
          </>
        ) : null}
      </p>

      {reference ? (
        <div className="mt-8 inline-flex flex-col rounded-2xl bg-navy px-6 py-5 text-white">
          <span className="type-label text-mint">Your reference</span>
          <span className="type-heading mt-1 text-2xl">{reference}</span>
        </div>
      ) : null}

      <div className="mt-12 rounded-2xl bg-white p-6 sm:p-8">
        <h2 className="type-heading text-xl">What happens next</h2>
        <ol className="mt-5 space-y-4 text-body text-navy/75">
          <li className="flex gap-4">
            <span className="mt-2.5 h-1.5 w-6 shrink-0 bg-blue" />
            The committee reviews every application on the strength of the
            idea, the founder, the traction and the pitch.
          </li>
          <li className="flex gap-4">
            <span className="mt-2.5 h-1.5 w-6 shrink-0 bg-mint" />
            A shortlist is selected, mentored and rehearsed.
          </li>
          <li className="flex gap-4">
            <span className="mt-2.5 h-1.5 w-6 shrink-0 bg-blue" />
            Finalists pitch live on {programme.event.date} in{" "}
            {programme.event.location}.
          </li>
        </ol>

        <p className="mt-7 text-sm leading-6 text-navy/60">
          We will email you whenever your status changes. You can also check it
          yourself at any time.
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

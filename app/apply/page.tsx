import { loadDraft } from "./_lib";
import { FounderForm } from "./_components/founder-form";
import { STEPS } from "./_steps";

export default async function FounderStep() {
  const draft = await loadDraft();

  return (
    <>
      <p className="type-label text-blue">{STEPS[0].eyebrow}</p>
      <h1 className="type-display mt-4 text-h2">About you</h1>
      <p className="mt-4 max-w-xl text-body text-navy/70">
        Start with who you are and how to reach you. We save your progress from
        here, so you can stop and come back.
      </p>

      <div className="mt-12">
        <FounderForm defaults={draft?.founder} />
      </div>
    </>
  );
}

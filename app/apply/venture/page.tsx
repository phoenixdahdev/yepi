import { requireDraft } from "../_lib";
import { requireApplicationsOpen } from "../../_lib/applications";
import { VentureForm } from "../_components/venture-form";
import { STEPS } from "../_steps";

export default async function VentureStep() {
  requireApplicationsOpen();
  const draft = await requireDraft();

  return (
    <>
      <p className="type-label text-blue">{STEPS[1].eyebrow}</p>
      <h1 className="type-display mt-4 text-h2">Your venture</h1>
      <p className="mt-4 max-w-xl text-body text-navy/70">
        What you are building, and where it is right now.
      </p>

      <div className="mt-12">
        <VentureForm defaults={draft.venture} />
      </div>
    </>
  );
}

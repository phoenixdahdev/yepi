import { requireDraft } from "../_lib";
import { requireApplicationsOpen } from "../../_lib/applications";
import { TractionForm } from "../_components/traction-form";
import { STEPS } from "../_steps";

export default async function TractionStep() {
  requireApplicationsOpen();
  const draft = await requireDraft();

  return (
    <>
      <p className="type-label text-blue">{STEPS[2].eyebrow}</p>
      <h1 className="type-display mt-4 text-h2">Traction</h1>
      <p className="mt-4 max-w-xl text-body text-navy/70">
        What you have actually done. Early is fine — judges are reading for
        evidence of movement, not scale.
      </p>

      <div className="mt-12">
        <TractionForm defaults={draft.traction} />
      </div>
    </>
  );
}

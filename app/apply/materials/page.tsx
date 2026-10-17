import { requireDraft } from "../_lib";
import { MaterialsForm } from "../_components/materials-form";
import { STEPS } from "../_steps";

export default async function MaterialsStep() {
  const draft = await requireDraft();

  return (
    <>
      <p className="type-label text-blue">{STEPS[3].eyebrow}</p>
      <h1 className="type-display mt-4 text-h2">Your pitch</h1>
      <p className="mt-4 max-w-xl text-body text-navy/70">
        The materials the committee reads. Files upload as you attach them, so
        give the deck a moment before you continue.
      </p>

      <div className="mt-12">
        <MaterialsForm draftId={draft.id} defaults={draft.materials} />
      </div>
    </>
  );
}

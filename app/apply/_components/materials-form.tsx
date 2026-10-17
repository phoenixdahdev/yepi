"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { materialsSchema, type MaterialsInput } from "../../_lib/schemas";
import { saveMaterials } from "../actions";
import { FilePicker } from "./file-picker";
import { FieldGrid, FieldRow, FormAlert, StepActions, WIDE, useStepMutation } from "./form-kit";

export function MaterialsForm({
  draftId,
  defaults,
}: {
  draftId: string;
  defaults?: {
    executiveSummary?: string;
    elevatorPitch?: string;
    pitchDeck?: MaterialsInput["pitchDeck"];
    supporting?: MaterialsInput["supporting"];
  };
}) {
  const [uploading, setUploading] = useState(false);

  const form = useForm<MaterialsInput>({
    resolver: zodResolver(materialsSchema),
    defaultValues: {
      executiveSummary: defaults?.executiveSummary ?? "",
      elevatorPitch: defaults?.elevatorPitch ?? "",
      pitchDeck: defaults?.pitchDeck ?? null,
      supporting: defaults?.supporting ?? [],
    },
  });
  const { mutation, formError, busy } = useStepMutation(saveMaterials, form);
  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} noValidate>
      <FormAlert message={formError} />

      <FieldGrid>
        <FieldRow
          className={WIDE}
          name="executiveSummary"
          label="Executive summary"
          hint="Cover four things: the problem, your solution, the market, and how you will execute."
          error={errors.executiveSummary?.message}
        >
          <Textarea
            id="executiveSummary"
            rows={12}
            maxLength={5000}
            {...form.register("executiveSummary")}
          />
        </FieldRow>

        <FieldRow
          className={WIDE}
          name="elevatorPitch"
          label="One-minute elevator pitch"
          hint="Write it as you would say it out loud in sixty seconds."
          error={errors.elevatorPitch?.message}
        >
          <Textarea
            id="elevatorPitch"
            rows={6}
            maxLength={1200}
            {...form.register("elevatorPitch")}
          />
        </FieldRow>

        <FieldRow
          name="pitchDeck"
          label="Pitch deck"
          hint="PDF, up to 20 MB."
          error={errors.pitchDeck?.message}
        >
          <Controller
            control={form.control}
            name="pitchDeck"
            render={({ field }) => (
              <FilePicker
                draftId={draftId}
                kind="deck"
                accept="application/pdf"
                value={field.value ? [field.value] : []}
                onChange={(files) => field.onChange(files[0] ?? null)}
                onBusyChange={setUploading}
              />
            )}
          />
        </FieldRow>

        <FieldRow
          name="supporting"
          label="Supporting documents"
          hint="Optional — projections, letters of support, product screenshots. Up to 10 MB each."
          error={errors.supporting?.message}
        >
          <Controller
            control={form.control}
            name="supporting"
            render={({ field }) => (
              <FilePicker
                draftId={draftId}
                kind="supporting"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.pptx,.docx,.xlsx"
                multiple
                value={field.value ?? []}
                onChange={field.onChange}
                onBusyChange={setUploading}
              />
            )}
          />
        </FieldRow>
      </FieldGrid>

      <StepActions
        back="/apply/traction"
        label="Continue to review"
        busy={busy || uploading}
      />
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tractionSchema, type TractionInput } from "../../_lib/schemas";
import { saveTraction } from "../actions";
import { FieldGrid, FieldRow, FormAlert, StepActions, WIDE, useStepMutation } from "./form-kit";

export function TractionForm({ defaults }: { defaults?: TractionInput }) {
  const form = useForm<TractionInput>({
    resolver: zodResolver(tractionSchema),
    defaultValues: {
      operatingSince: defaults?.operatingSince ?? "",
      progress: defaults?.progress ?? "",
      teamSize: defaults?.teamSize ?? 1,
    },
  });
  const { mutation, formError, busy } = useStepMutation(saveTraction, form);
  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} noValidate>
      <FormAlert message={formError} />

      <FieldGrid>
        <FieldRow
          name="operatingSince"
          label="How long have you been going?"
          hint="However you measure it — since you started building, trading, or testing."
          error={errors.operatingSince?.message}
        >
          <Input id="operatingSince" placeholder="e.g. 14 months" {...form.register("operatingSince")} />
        </FieldRow>

        <FieldRow
          className={WIDE}
          name="progress"
          label="Progress so far"
          hint="Users, revenue, partnerships, pilots, contracts, prototypes — whatever is real. Numbers help."
          error={errors.progress?.message}
        >
          <Textarea id="progress" rows={7} maxLength={2000} {...form.register("progress")} />
        </FieldRow>

        <FieldRow
          name="teamSize"
          label="How many people are involved?"
          hint="Founders plus team."
          error={errors.teamSize?.message}
        >
          <Input
            id="teamSize"
            type="number"
            inputMode="numeric"
            min={1}
            {...form.register("teamSize")}
          />
        </FieldRow>
      </FieldGrid>

      <StepActions back="/apply/venture" busy={busy} />
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CIPC_OPTIONS,
  STAGES,
  ventureSchema,
  type VentureInput,
} from "../../_lib/schemas";
import { saveVenture } from "../actions";
import { FieldGrid, FieldRow, FormAlert, StepActions, WIDE, useStepMutation } from "./form-kit";

export function VentureForm({ defaults }: { defaults?: VentureInput }) {
  const form = useForm<VentureInput>({
    resolver: zodResolver(ventureSchema),
    defaultValues: {
      ventureName: defaults?.ventureName ?? "",
      description: defaults?.description ?? "",
      location: defaults?.location ?? "",
      stage: defaults?.stage,
      website: defaults?.website ?? "",
      cipcStatus: defaults?.cipcStatus,
    },
  });
  const { mutation, formError, busy } = useStepMutation(saveVenture, form);
  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} noValidate>
      <FormAlert message={formError} />

      <FieldGrid>
        <FieldRow
          name="ventureName"
          label="Venture or trading name"
          hint="A trading name is fine. A registered name is not required."
          error={errors.ventureName?.message}
        >
          <Input id="ventureName" {...form.register("ventureName")} />
        </FieldRow>
        <FieldRow
          name="location"
          label="Primary location"
          hint="City, province or country."
          error={errors.location?.message}
        >
          <Input id="location" {...form.register("location")} />
        </FieldRow>
        <FieldRow
          className={WIDE}
          name="description"
          label="What does it do?"
          hint="One to three sentences."
          error={errors.description?.message}
        >
          <Textarea id="description" rows={4} maxLength={400} {...form.register("description")} />
        </FieldRow>
        <FieldRow name="stage" label="Current stage" error={errors.stage?.message}>
          <Controller
            control={form.control}
            name="stage"
            render={({ field }) => (
              <Select value={field.value ?? null} onValueChange={field.onChange}>
                <SelectTrigger id="stage" className="w-full">
                  <SelectValue placeholder="Choose a stage" />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FieldRow>
        <FieldRow
          name="cipcStatus"
          label="Is the business already CIPC-registered?"
          hint="Optional, and for information only. This is never used for scoring and never excludes you."
          error={errors.cipcStatus?.message}
        >
          <Controller
            control={form.control}
            name="cipcStatus"
            render={({ field }) => (
              <Select value={field.value ?? null} onValueChange={field.onChange}>
                <SelectTrigger id="cipcStatus" className="w-full">
                  <SelectValue placeholder="Prefer not to say" />
                </SelectTrigger>
                <SelectContent>
                  {CIPC_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FieldRow>
        <FieldRow
          className={WIDE}
          name="website"
          label="Website or social media"
          hint="Optional."
          error={errors.website?.message}
        >
          <Input id="website" type="url" placeholder="https://" {...form.register("website")} />
        </FieldRow>
      </FieldGrid>

      <StepActions back="/apply" busy={busy} />
    </form>
  );
}

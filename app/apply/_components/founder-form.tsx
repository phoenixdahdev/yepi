"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { DateOfBirthField } from "./date-of-birth-field";
import { Textarea } from "@/components/ui/textarea";
import { founderSchema, type FounderInput } from "../../_lib/schemas";
import { saveFounder } from "../actions";
import { FieldGrid, FieldRow, FormAlert, StepActions, WIDE, useStepMutation } from "./form-kit";

export function FounderForm({ defaults }: { defaults?: FounderInput }) {
  const form = useForm<FounderInput>({
    resolver: zodResolver(founderSchema),
    defaultValues: {
      fullName: defaults?.fullName ?? "",
      dateOfBirth: defaults?.dateOfBirth ?? "",
      email: defaults?.email ?? "",
      mobile: defaults?.mobile ?? "",
      profileUrl: defaults?.profileUrl ?? "",
      legalStatusNote: defaults?.legalStatusNote ?? "",
    },
  });
  const { mutation, formError, busy } = useStepMutation(saveFounder, form);
  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} noValidate>
      <FormAlert message={formError} />

      <FieldGrid>
        <FieldRow name="fullName" label="Full name" error={errors.fullName?.message}>
          <Input id="fullName" autoComplete="name" {...form.register("fullName")} />
        </FieldRow>

        <FieldRow
          name="dateOfBirth"
          label="Date of birth"
          hint="YEPI is open to founders aged 18 to 35 on 31 October 2026."
          error={errors.dateOfBirth?.message}
        >
          <Controller
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <DateOfBirthField
                value={field.value ?? ""}
                onChange={field.onChange}
                invalid={Boolean(errors.dateOfBirth)}
              />
            )}
          />
        </FieldRow>

        <FieldRow
          name="email"
          label="Email address"
          hint="Everything about your application goes here, including the link back to this form."
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            {...form.register("email")}
          />
        </FieldRow>

        <FieldRow name="mobile" label="Mobile number" error={errors.mobile?.message}>
          <Input id="mobile" type="tel" inputMode="tel" autoComplete="tel" {...form.register("mobile")} />
        </FieldRow>

        <FieldRow
          className={WIDE}
          name="profileUrl"
          label="LinkedIn or professional profile"
          hint="Optional."
          error={errors.profileUrl?.message}
        >
          <Input id="profileUrl" type="url" placeholder="https://" {...form.register("profileUrl")} />
        </FieldRow>

        <FieldRow
          className={WIDE}
          name="legalStatusNote"
          label="Country of citizenship or legal status in South Africa"
          hint="Optional, and for information only. This does not affect your eligibility or how your application is scored."
          error={errors.legalStatusNote?.message}
        >
          <Textarea id="legalStatusNote" rows={3} {...form.register("legalStatusNote")} />
        </FieldRow>
      </FieldGrid>

      <StepActions busy={busy} />
    </form>
  );
}

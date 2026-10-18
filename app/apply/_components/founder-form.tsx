"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { DateOfBirthField } from "./date-of-birth-field";
import {
  AGE_REFERENCE_LABEL,
  founderSchema,
  type FounderInput,
} from "../../_lib/schemas";
import { saveFounder } from "../actions";
import { FieldGrid, FieldRow, FormAlert, StepActions, WIDE, useStepMutation } from "./form-kit";

export function FounderForm({ defaults }: { defaults?: FounderInput }) {
  const form = useForm<FounderInput>({
    resolver: zodResolver(founderSchema),
    defaultValues: {
      fullName: defaults?.fullName ?? "",
      dateOfBirth: defaults?.dateOfBirth ?? "",
      idNumber: defaults?.idNumber ?? "",
      email: defaults?.email ?? "",
      mobile: defaults?.mobile ?? "",
      profileUrl: defaults?.profileUrl ?? "",
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
          name="idNumber"
          label="South African ID number"
          hint="13 digits. We check it against your date of birth."
          error={errors.idNumber?.message}
        >
          <Input
            id="idNumber"
            inputMode="numeric"
            autoComplete="off"
            maxLength={16}
            placeholder="0000000000000"
            {...form.register("idNumber")}
          />
        </FieldRow>

        <FieldRow
          name="dateOfBirth"
          label="Date of birth"
          hint={`YEPI is open to founders aged 18 to 35 on ${AGE_REFERENCE_LABEL}.`}
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

      </FieldGrid>

      <StepActions busy={busy} />
    </form>
  );
}

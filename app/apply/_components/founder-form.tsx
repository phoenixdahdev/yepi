"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AGE_REFERENCE_LABEL,
  founderSchema,
  type FounderInput,
} from "../../_lib/schemas";
import { saveFounder } from "../actions";
import { DateOfBirthField } from "./date-of-birth-field";
import { FieldGrid, FieldRow, FormAlert, StepActions, WIDE, useStepMutation } from "./form-kit";

const DOCUMENTS = [
  {
    value: "sa-id" as const,
    label: "South African ID",
    hint: "Citizens and permanent residents",
  },
  {
    value: "passport" as const,
    label: "Passport",
    hint: "Anyone else living lawfully in South Africa",
  },
];

export function FounderForm({ defaults }: { defaults?: FounderInput }) {
  const form = useForm<FounderInput>({
    resolver: zodResolver(founderSchema),
    defaultValues: {
      fullName: defaults?.fullName ?? "",
      idType: defaults?.idType ?? "sa-id",
      idNumber: defaults?.idNumber ?? "",
      passportNumber: defaults?.passportNumber ?? "",
      nationality: defaults?.nationality ?? "",
      dateOfBirth: defaults?.dateOfBirth ?? "",
      email: defaults?.email ?? "",
      mobile: defaults?.mobile ?? "",
      profileUrl: defaults?.profileUrl ?? "",
    },
  });
  const { mutation, formError, busy } = useStepMutation(saveFounder, form);
  const errors = form.formState.errors;
  const idType = form.watch("idType");

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
          className={WIDE}
          name="idType"
          label="Which document will you use?"
          hint="Either is accepted. You need to be living in South Africa lawfully, not to be a citizen."
          error={errors.idType?.message}
        >
          <Controller
            control={form.control}
            name="idType"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-3 sm:grid-cols-2"
              >
                {DOCUMENTS.map((doc) => (
                  <Label
                    key={doc.value}
                    htmlFor={`idType-${doc.value}`}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-input bg-background px-4 py-3 font-normal transition-colors has-[[data-checked]]:border-ring"
                  >
                    <RadioGroupItem
                      id={`idType-${doc.value}`}
                      value={doc.value}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {doc.label}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {doc.hint}
                      </span>
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            )}
          />
        </FieldRow>

        {idType === "sa-id" ? (
          <FieldRow
            className={WIDE}
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
        ) : (
          <>
            <FieldRow
              name="passportNumber"
              label="Passport number"
              error={errors.passportNumber?.message}
            >
              <Input
                id="passportNumber"
                autoComplete="off"
                maxLength={14}
                {...form.register("passportNumber")}
              />
            </FieldRow>

            <FieldRow
              name="nationality"
              label="Country that issued it"
              error={errors.nationality?.message}
            >
              <Input
                id="nationality"
                autoComplete="country-name"
                placeholder="e.g. Zimbabwe"
                {...form.register("nationality")}
              />
            </FieldRow>
          </>
        )}

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

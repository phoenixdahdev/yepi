"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { consentSchema, type ConsentInput } from "../../_lib/schemas";
import { submitApplication } from "../actions";
import { FormAlert, StepActions, useStepMutation } from "./form-kit";

function ConsentBox({
  name,
  checked,
  onChange,
  error,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <Checkbox
          id={name}
          checked={checked}
          onCheckedChange={(value) => onChange(value === true)}
          className="mt-0.5"
        />
        <Label htmlFor={name} className="text-sm leading-6 font-normal text-foreground">
          {children}
        </Label>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ConsentForm() {
  const form = useForm<ConsentInput>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      accurate: false as unknown as true,
      terms: false as unknown as true,
      popia: false as unknown as true,
    },
  });
  const { mutation, formError, busy } = useStepMutation(submitApplication, form);
  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} noValidate>
      <FormAlert message={formError} />

      <Card>
        <CardContent className="space-y-5">
          <Controller
            control={form.control}
            name="accurate"
            render={({ field }) => (
              <ConsentBox
                name="accurate"
                checked={field.value === true}
                onChange={field.onChange}
                error={errors.accurate?.message}
              >
                I confirm the information in this application is accurate.
              </ConsentBox>
            )}
          />

          <Controller
            control={form.control}
            name="terms"
            render={({ field }) => (
              <ConsentBox
                name="terms"
                checked={field.value === true}
                onChange={field.onChange}
                error={errors.terms?.message}
              >
                I accept the{" "}
                <Link href="/terms" className="underline underline-offset-4">
                  terms of participation
                </Link>
                .
              </ConsentBox>
            )}
          />

          <Controller
            control={form.control}
            name="popia"
            render={({ field }) => (
              <ConsentBox
                name="popia"
                checked={field.value === true}
                onChange={field.onChange}
                error={errors.popia?.message}
              >
                I consent to YEPI processing my personal information for this
                programme, as described in the{" "}
                <Link href="/privacy" className="underline underline-offset-4">
                  privacy notice
                </Link>
                , in line with POPIA.
              </ConsentBox>
            )}
          />
        </CardContent>
      </Card>

      <StepActions back="/apply/materials" label="Submit application" busy={busy} />
    </form>
  );
}

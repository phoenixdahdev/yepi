"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "../../_lib/schemas";

/**
 * One mutation per step. The server action re-validates and returns a result
 * rather than redirecting, so TanStack Query can own pending and error state
 * and the client decides when to navigate.
 */
export function useStepMutation<T extends FieldValues>(
  action: (values: T) => Promise<ActionResult>,
  form: { setError: UseFormSetError<T> },
) {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();

  const mutation = useMutation({
    mutationFn: action,
    onMutate: () => setFormError(undefined),
    onSuccess: (result) => {
      if (result.ok) {
        if (result.next) router.push(result.next);
        return;
      }

      // Server-side validation wins: map its field errors back onto the form.
      for (const [field, messages] of Object.entries(result.errors ?? {})) {
        if (messages?.[0]) {
          form.setError(field as Path<T>, { message: messages[0] });
        }
      }
      setFormError(result.message);
    },
    onError: (error) => {
      console.error("[apply] mutation", error);
      setFormError(
        "We could not reach the server. Check your connection and try again.",
      );
    },
  });

  // Stay busy through the navigation that follows a success, so the button
  // cannot be pressed twice on a slow connection.
  const busy = mutation.isPending || (mutation.isSuccess && mutation.data?.ok === true);

  return { mutation, formError, busy };
}

export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Alert variant="destructive" className="mb-8">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

/**
 * Label and control sit flush at the top so two fields side by side always
 * line up; the hint hangs underneath, where a longer one can wrap without
 * shunting its neighbour's input down the page.
 */
export function FieldRow({
  name,
  label,
  hint,
  error,
  className,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const describedBy =
    [hint ? `${name}-hint` : null, error ? `${name}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  // Wire the hint and error to the control itself, so a screen reader reads
  // them with the field rather than leaving them floating beside it.
  const control =
    describedBy && isValidElement(children)
      ? cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
          "aria-describedby": describedBy,
        })
      : children;

  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <div className="mt-2">{control}</div>
      {hint ? (
        <p id={`${name}-hint`} className="mt-2 text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-2 text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Two fields per row on anything wider than a phone. */
export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-7 sm:grid-cols-2">{children}</div>;
}

/** Full-bleed cell for textareas and anything that needs the width. */
export const WIDE = "sm:col-span-2";

export function StepActions({
  back,
  label = "Continue",
  busy,
}: {
  back?: string;
  label?: string;
  busy: boolean;
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border pt-8">
      <Button type="submit" size="lg" disabled={busy} className="type-label rounded-full px-7">
        {busy ? "Saving…" : label}
        <span aria-hidden="true">↑</span>
      </Button>

      {back ? (
        <Link
          href={back}
          className="text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back
        </Link>
      ) : null}

      <p className="w-full text-sm text-muted-foreground">
        Your answers are saved as you go. You can close this and come back.
      </p>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { statusRequestSchema } from "../../_lib/schemas";
import { requestStatusLink } from "../actions";

type Values = { email: string };

export function RequestLinkForm({ expired }: { expired?: boolean }) {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string>();

  const form = useForm<Values>({
    resolver: zodResolver(statusRequestSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: requestStatusLink,
    onMutate: () => setFormError(undefined),
    onSuccess: (result) => {
      if (result.ok) {
        setSent(true);
        return;
      }
      if (result.errors?.email?.[0]) {
        form.setError("email", { message: result.errors.email[0] });
      }
      setFormError(result.message);
    },
    onError: () =>
      setFormError("We could not reach the server. Check your connection and try again."),
  });

  if (sent) {
    return (
      <Card className="border-mint bg-mint/10">
        <CardContent>
          <h2 className="type-heading text-xl">Check your email</h2>
          <p className="mt-3 text-body text-muted-foreground">
            If we have an application for that address, we&rsquo;ve sent a link
            to open its status. The link lasts 30 minutes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          noValidate
        >
          {expired ? (
            <Alert className="mb-6">
              <AlertDescription>
                That link has expired. Enter your email and we&rsquo;ll send a
                new one.
              </AlertDescription>
            </Alert>
          ) : null}

          {formError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <Label htmlFor="email" className="text-sm font-semibold">
            The email you applied with
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="mt-2"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p role="alert" className="mt-2 text-sm font-semibold text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={mutation.isPending}
            className="type-label mt-6 rounded-full px-7"
          >
            {mutation.isPending ? "Sending…" : "Email me a link"}
            <span aria-hidden="true">↑</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

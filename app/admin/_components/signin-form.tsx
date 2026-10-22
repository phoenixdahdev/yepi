"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../signin/actions";

const schema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});
type Values = z.infer<typeof schema>;

export function AdminSigninForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: signIn,
    onMutate: () => setFormError(undefined),
    onSuccess: (r) => {
      if (r.ok) return router.push(r.next ?? "/admin");
      for (const [field, msgs] of Object.entries(r.errors ?? {})) {
        if (msgs?.[0]) form.setError(field as keyof Values, { message: msgs[0] });
      }
      setFormError(r.message);
    },
    onError: () => setFormError("Could not reach the server. Try again."),
  });

  // Stays busy through the navigation that follows a success.
  const busy = mutation.isPending || (mutation.isSuccess && mutation.data?.ok === true);

  return (
    <Card>
      <CardContent>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} noValidate>
          {formError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                className="mt-2"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p role="alert" className="mt-2 text-sm font-semibold text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-2"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p role="alert" className="mt-2 text-sm font-semibold text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="type-label mt-7 rounded-full px-7"
          >
            {busy ? "Signing in…" : "Sign in"}
            <span aria-hidden="true">↑</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

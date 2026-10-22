"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ApplicationStatus } from "../../_lib/schemas";
import { changeStatus, saveNotes } from "../(authed)/actions";
import { ADMIN_STATUS, SETTABLE } from "../_status";

export function ReviewPanel({
  id,
  status,
  notes,
  myScore,
}: {
  id: string;
  status: ApplicationStatus;
  notes: string;
  myScore?: number;
}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [saved, setSaved] = useState<string>();
  const [draftNotes, setDraftNotes] = useState(notes);
  const [score, setScore] = useState(myScore ? String(myScore) : "");

  const statusMutation = useMutation({
    mutationFn: (to: ApplicationStatus) => changeStatus(id, to),
    onMutate: () => { setError(undefined); setSaved(undefined); },
    onSuccess: (r) => {
      if (!r.ok) return setError(r.message);
      setSaved("Status updated.");
      router.refresh();
    },
    onError: () => setError("Could not reach the server."),
  });

  const notesMutation = useMutation({
    mutationFn: () =>
      saveNotes(id, {
        notes: draftNotes,
        score: score === "" ? undefined : Number(score),
      }),
    onMutate: () => { setError(undefined); setSaved(undefined); },
    onSuccess: (r) => {
      if (!r.ok) return setError(r.message);
      setSaved("Saved.");
      router.refresh();
    },
    onError: () => setError("Could not reach the server."),
  });

  return (
    <div className="space-y-7">
      {error ? (
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
      ) : null}
      {saved ? (
        <p className="text-sm font-semibold text-mint-foreground text-blue">{saved}</p>
      ) : null}

      <div>
        <Label className="text-sm font-semibold">Status</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {SETTABLE.map((s) => (
            <button
              key={s}
              type="button"
              disabled={statusMutation.isPending || s === status}
              onClick={() => statusMutation.mutate(s)}
              className={`type-label rounded-full px-4 py-2 transition-colors disabled:cursor-default ${
                s === status
                  ? ADMIN_STATUS[s].tone
                  : "bg-white text-navy/60 hover:text-navy border border-border"
              }`}
            >
              {ADMIN_STATUS[s].label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Changing this is recorded against your email. The applicant sees the
          new status on their status page.
        </p>
      </div>

      <div>
        <Label htmlFor="score" className="text-sm font-semibold">
          Your score (1–10)
        </Label>
        <input
          id="score"
          type="number"
          min={1}
          max={10}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="mt-2 w-24 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:border-ring"
        />
      </div>

      <div>
        <Label htmlFor="notes" className="text-sm font-semibold">
          Private notes
        </Label>
        <Textarea
          id="notes"
          rows={6}
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
          className="mt-2"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Shared with the committee, never with the applicant.
        </p>
      </div>

      <Button
        type="button"
        size="lg"
        disabled={notesMutation.isPending}
        onClick={() => notesMutation.mutate()}
        className="type-label rounded-full px-7"
      >
        {notesMutation.isPending ? "Saving…" : "Save notes"}
      </Button>
    </div>
  );
}

"use client";

import { upload } from "@vercel/blob/client";
import { useId, useState } from "react";
import { Progress } from "@/components/ui/progress";
import type { UploadedFile } from "../../_lib/schemas";

const prettySize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; percent: number }
  | { kind: "error"; message: string };

/**
 * Controlled by react-hook-form. Uploads straight from the browser to Blob —
 * a 20 MB deck cannot be POSTed through a route handler, since Vercel caps
 * request bodies at 4.5 MB.
 *
 * ACCESS: "public" is a deliberate decision, not an oversight. The connected
 * Blob store is a public store. Uploaded URLs carry a random suffix so they
 * are unguessable, but anyone holding a link can read the file indefinitely
 * and the link cannot be revoked. Since these are confidential business plans
 * attached to named people, the POPIA notice must say so.
 *
 * To move to private later: create a store with
 *   vercel blob create-store <name> --access private
 * swap BLOB_READ_WRITE_TOKEN, change this to "private", and add an
 * authenticated route that streams the file for reviewers.
 */
export function FilePicker({
  draftId,
  kind,
  accept,
  multiple = false,
  value,
  onChange,
  onBusyChange,
}: {
  draftId: string;
  kind: "deck" | "supporting";
  accept: string;
  multiple?: boolean;
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputId = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function setBusy(busy: boolean) {
    onBusyChange?.(busy);
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (chosen.length === 0) return;

    setStatus({ kind: "uploading", percent: 0 });
    setBusy(true);

    try {
      const uploaded: UploadedFile[] = [];

      for (const file of chosen) {
        const blob = await upload(`applications/${draftId}/${kind}/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/blob-upload",
          multipart: file.size > 8 * 1024 * 1024,
          onUploadProgress: ({ percentage }) =>
            setStatus({ kind: "uploading", percent: Math.round(percentage) }),
        });

        uploaded.push({
          url: blob.url,
          pathname: blob.pathname,
          filename: file.name,
          size: file.size,
          contentType: file.type,
        });
      }

      onChange(multiple ? [...value, ...uploaded] : uploaded);
      setStatus({ kind: "idle" });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "That upload did not go through. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  const uploading = status.kind === "uploading";

  return (
    <div>
      {value.length > 0 ? (
        <ul className="mb-3 space-y-2">
          {value.map((file) => (
            <li
              key={file.pathname}
              className="flex items-center justify-between gap-4 rounded-lg border border-mint bg-mint/10 px-4 py-3"
            >
              <span className="min-w-0 text-sm">
                <span className="block truncate font-semibold text-foreground">
                  {file.filename}
                </span>
                <span className="text-muted-foreground">{prettySize(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((f) => f.pathname !== file.pathname))}
                className="shrink-0 text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-input bg-background px-4 py-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
      >
        {uploading
          ? `Uploading… ${status.percent}%`
          : value.length > 0 && !multiple
            ? "Replace file"
            : "Choose a file"}
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={uploading}
        onChange={handleChange}
        className="sr-only"
      />

      {uploading ? <Progress value={status.percent} className="mt-3" /> : null}

      {status.kind === "error" ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-destructive">
          {status.message}
        </p>
      ) : null}
    </div>
  );
}

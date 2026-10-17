"use client";

import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AGE_REFERENCE } from "../../_lib/schemas";

/**
 * The window in which a founder is 18-35 on the event date. Constraining the
 * calendar makes the eligibility rule visible while choosing, instead of only
 * rejecting it on submit. The schema still enforces it server-side.
 */
function validWindow() {
  const r = AGE_REFERENCE;
  const earliest = new Date(r.getFullYear() - 36, r.getMonth(), r.getDate() + 1);
  const latest = new Date(r.getFullYear() - 18, r.getMonth(), r.getDate());
  return { earliest, latest };
}

/** Stored as yyyy-MM-dd. Parsed and formatted locally — toISOString() would
 *  shift the date across a timezone boundary and lose a day. */
export function DateOfBirthField({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { earliest, latest } = validWindow();

  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const valid = selected && !Number.isNaN(selected.getTime()) ? selected : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            id="dateOfBirth"
            aria-invalid={invalid || undefined}
            className="w-full justify-between px-4 py-3 font-normal h-auto"
          >
            <span className={valid ? "" : "text-muted-foreground"}>
              {valid ? format(valid, "d MMMM yyyy") : "Choose your date of birth"}
            </span>
            <CalendarIcon aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={valid}
          defaultMonth={valid ?? new Date(2000, 0)}
          captionLayout="dropdown"
          startMonth={earliest}
          endMonth={latest}
          disabled={{ before: earliest, after: latest }}
          onSelect={(date) => {
            if (!date) return;
            onChange(format(date, "yyyy-MM-dd"));
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

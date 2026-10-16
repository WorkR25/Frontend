"use client";

import { CalendarDays, Workflow } from "lucide-react";
import { cn } from "@/utils/cn";

export type CandidatesView = "signups" | "nurture";

const OPTIONS: { value: CandidatesView; label: string; icon: React.ReactNode }[] = [
  { value: "signups", label: "Sign-ups", icon: <CalendarDays className="h-4 w-4" aria-hidden="true" /> },
  { value: "nurture", label: "Nurture leads", icon: <Workflow className="h-4 w-4" aria-hidden="true" /> },
];

/** Switches the All candidates modal between the sign-ups list and the nurture-sequence leads. */
export default function CandidatesViewSwitch({
  view,
  onChange,
}: {
  view: CandidatesView;
  onChange: (view: CandidatesView) => void;
}) {
  return (
    <div role="tablist" aria-label="Candidates view" className="mb-5 inline-flex gap-1 rounded-2xl bg-[#EAEEF6] p-1">
      {OPTIONS.map((option) => {
        const active = option.value === view;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => !active && onChange(option.value)}
            className={cn(
              "flex h-10 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm transition-colors",
              active ? "bg-white font-bold text-[#142463] shadow-sm" : "font-semibold text-[#5B6478] hover:text-[#142463]",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { JOB_LIST_TABS, JobListTab, JobTabCounts } from "@/types/GetJobType";
import { cn } from "@/utils/cn";

export const JOB_TAB_LABELS: Record<JobListTab, string> = {
  all: "All jobs",
  new: "New today",
  remote: "Remote",
  onsite: "On-site",
  intern: "Internships",
};

export default function JobTabs({
  active,
  counts,
  onChange,
}: {
  active: JobListTab;
  counts?: JobTabCounts;
  onChange: (tab: JobListTab) => void;
}) {
  return (
    <div role="tablist" aria-label="Quick filters" className="flex flex-wrap gap-2">
      {JOB_LIST_TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={cn(
              "flex h-10 cursor-pointer items-center gap-2 rounded-full border pl-4 text-sm transition-colors",
              counts ? "pr-2" : "pr-4",
              isActive
                ? "border-[#142463] bg-[#142463] font-bold text-white"
                : "border-[#E4E8F0] bg-white font-semibold text-[#344054] hover:border-[#2451D6] hover:text-[#2451D6]",
            )}
          >
            {JOB_TAB_LABELS[tab]}
            {counts && (
              <span
                className={cn(
                  "min-w-[26px] rounded-full px-2 py-0.5 text-center text-xs",
                  isActive ? "bg-white/20" : "bg-[#F1F4F9] text-[#5B6478]",
                )}
              >
                {counts[tab]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

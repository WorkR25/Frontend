"use client";

import { ChevronDown, ExternalLink, Loader2, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { getCompanyMonogram, getCompanyTint } from "@/utils/companyBrand";
import { timeAgo } from "@/utils/getTime";
import useCandidateApplications, { CandidateApplicationType } from "@/utils/useCandidateApplications";

type ApplicationsQuery = ReturnType<typeof useCandidateApplications>;

const exactDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
};

/** The "APPLIED" column: a count chip that also opens the list of jobs. */
export function AppliedCell({
  query,
  expanded,
  onToggle,
  panelId,
}: {
  query: ApplicationsQuery;
  expanded: boolean;
  onToggle: () => void;
  panelId: string;
}) {
  if (query.isPending) {
    return <span aria-label="Loading applications" className="block h-7 w-20 animate-pulse rounded-full bg-[#EEF1F6]" />;
  }

  if (query.isError) {
    return (
      <button
        type="button"
        onClick={() => query.refetch()}
        title="Couldn’t load applications. Click to retry"
        className="flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-[#E4B4B0] px-2.5 text-xs font-bold text-[#B42318] hover:bg-[#FDECEC]"
      >
        <RotateCcw className="h-3 w-3" aria-hidden="true" />
        Retry
      </button>
    );
  }

  const total = query.data?.pages[0]?.total_applications ?? 0;
  if (total === 0) {
    return <span className="text-sm text-[#A3ACBD]">None yet</span>;
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={panelId}
      title={expanded ? "Hide applied jobs" : "Show applied jobs"}
      className={cn(
        "flex h-7 cursor-pointer items-center gap-1 rounded-full pl-2.5 pr-1.5 text-xs font-bold transition-colors",
        expanded ? "bg-[#2451D6] text-white" : "bg-[#EAF0FD] text-[#1A3FAF] hover:bg-[#DCE6FB]",
      )}
    >
      {total} {total === 1 ? "job" : "jobs"}
      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
    </button>
  );
}

function CompanyMark({ name, logo }: { name: string; logo: string | null }) {
  const tint = getCompanyTint(name);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showLogo = !!logo && !failed;
  // The monogram is always underneath, so there is never a blank square while the logo loads.
  return (
    <span
      className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] text-xs font-extrabold"
      style={{ background: tint.bg, color: tint.fg }}
    >
      <span aria-hidden="true">{getCompanyMonogram(name)}</span>
      {showLogo && (
        <Image
          src={logo}
          alt=""
          width={36}
          height={36}
          unoptimized
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full rounded-[10px] border border-[#E4E8F0] bg-white object-contain p-1 transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}

function ApplicationItem({ item, index }: { item: CandidateApplicationType; index: number }) {
  const company = item.company_name || "Unknown company";
  return (
    <li
      className="wr-fade-up flex items-center gap-3 rounded-xl bg-white px-3 py-2.5"
      style={{ animationDelay: `${Math.min(index % 10, 8) * 30}ms` }}
    >
      <CompanyMark name={company} logo={item.company_logo} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-[#0F172A]">{item.job_title || "Untitled role"}</div>
        <div className="truncate text-xs text-[#5B6478]">{company}</div>
      </div>
      <time dateTime={item.applied_at} title={exactDate(item.applied_at)} className="shrink-0 text-xs text-[#5B6478]">
        Applied {timeAgo(item.applied_at)}
      </time>
      <a
        href={`/dashboard/jobs/${item.job_id}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${item.job_title ?? "job"} at ${company}`}
        title="Open job"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E4E8F0] text-[#344054] hover:border-[#2451D6] hover:text-[#2451D6]"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    </li>
  );
}

/**
 * The expanded list under a candidate row. It stays mounted after the first open so closing animates too:
 * the height eases between 0 and its content size (grid-template-rows) instead of snapping.
 */
export function ApplicationsPanel({
  query,
  id,
  name,
  expanded,
}: {
  query: ApplicationsQuery;
  id: string;
  name: string;
  expanded: boolean;
}) {
  const items = query.data?.pages.flatMap((page) => page.applications) ?? [];
  const total = query.data?.pages[0]?.total_applications ?? 0;
  const ref = useRef<HTMLDivElement>(null);

  // On first open the panel mounts collapsed and is expanded a frame later, so the height has something to transition from.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!expanded) {
      setShown(false);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [expanded]);

  // If the list opens near the bottom of the scroll area, bring it fully into view once it has grown.
  useEffect(() => {
    if (!expanded) return;
    const timer = window.setTimeout(() => ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 320);
    return () => window.clearTimeout(timer);
  }, [expanded]);

  return (
    <div
      ref={ref}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="min-h-0 overflow-hidden" inert={!shown}>
        <div
          id={id}
          role="region"
          aria-label={`Jobs applied by ${name}`}
          className="border-t border-[#E4E8F0] bg-[#F7F9FD] px-4 py-3 md:px-5"
        >
          <div className="mb-2 text-xs font-bold tracking-[0.08em] text-[#5B6478]">
            APPLIED JOBS · {total} · NEWEST FIRST
          </div>
          <ul className="flex flex-col gap-1.5">
            {items.map((item, index) => (
              <ApplicationItem key={item.application_id} item={item} index={index} />
            ))}
          </ul>
          {query.hasNextPage && (
            <button
              type="button"
              onClick={() => query.fetchNextPage()}
              disabled={query.isFetchingNextPage}
              className="mt-2.5 flex h-9 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-[#B9CBF3] bg-white px-3.5 text-[13px] font-bold text-[#2451D6] hover:border-[#2451D6] disabled:cursor-wait disabled:opacity-70"
            >
              {query.isFetchingNextPage && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
              Show more ({total - items.length} left)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

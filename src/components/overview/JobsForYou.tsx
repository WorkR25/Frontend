"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import JobCard from "@/components/JobCard";
import { useAppSelector } from "@/lib/hooks";
import { JobListTab } from "@/types/GetJobType";
import { cn } from "@/utils/cn";
import useExploreJobs from "@/utils/useExploreJobs";

const TABS: { id: JobListTab; label: string }[] = [
  { id: "all", label: "Latest" },
  { id: "new", label: "New today" },
  { id: "remote", label: "Remote" },
  { id: "intern", label: "Internships" },
];

export default function JobsForYou() {
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const [tab, setTab] = useState<JobListTab>("all");
  const { data, isPending, isFetching } = useExploreJobs(jwtToken, { page: 1, limit: 6, tab });
  const jobs = data?.records ?? [];

  return (
    <section className="flex flex-col gap-[18px] rounded-[22px] border border-[#E4E8F0] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">Jobs for you</h2>
          <p className="text-[13px] text-[#5B6478]">Fresh roles from product companies</p>
        </div>
        <Link
          href={tab === "all" ? "/dashboard/jobs" : `/dashboard/jobs?tab=${tab}`}
          className="flex items-center gap-1.5 text-sm font-bold text-[#2451D6] no-underline hover:text-[#1A3FAF]"
        >
          See all jobs
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>

      <div role="tablist" aria-label="Job filters" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "h-9 cursor-pointer rounded-full px-3.5 text-[13px] transition-colors",
              tab === t.id
                ? "bg-[#142463] font-bold text-white"
                : "border border-[#E4E8F0] font-semibold text-[#344054] hover:border-[#2451D6] hover:text-[#2451D6]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[220px] animate-pulse rounded-[20px] border border-[#E4E8F0] bg-[#F7F8FC]" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[#C9D2E3] px-6 py-10 text-center text-sm text-[#5B6478]">
          No jobs here right now — check back soon.
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 transition-opacity",
            isFetching && "opacity-60",
          )}
        >
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              img={job.company.logo}
              title={job.jobTitle.title}
              company={job.company.name}
              employmentType={job.employmentType?.name}
              city={job.city}
              country={job.country}
              minPay={job.salary_min}
              maxPay={job.salary_max}
              created_at={job.created_at}
              skills={job.skills}
              isRemote={job.is_remote}
            />
          ))}
        </div>
      )}
    </section>
  );
}

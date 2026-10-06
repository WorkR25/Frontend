"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { useAppSelector } from "@/lib/hooks";
import useExploreJobs from "@/utils/useExploreJobs";
import { companyJobsHref } from "./companyJobsHref";

/** Other open roles at the same company, linking into the company-filtered jobs list. */
export default function MoreJobsAtCompany({
  currentJobId,
  companyName,
  companyId,
  companyLogo,
}: {
  currentJobId: number;
  companyName: string;
  companyId?: number;
  companyLogo?: string;
}) {
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const { data } = useExploreJobs(
    jwtToken,
    { page: 1, limit: 4, companyId, company: companyId ? undefined : companyName },
    !!companyName,
  );

  const others = (data?.records ?? []).filter((job) => job.id !== currentJobId).slice(0, 3);
  const moreCount = Math.max((data?.pagination.totalCount ?? 0) - 1, 0);
  if (others.length === 0) return null;

  return (
    <section className="flex flex-col gap-1 rounded-3xl border border-[#E4E8F0] bg-white p-6">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-extrabold text-[#0F172A]">More jobs at {companyName}</h2>
        <span className="shrink-0 rounded-full bg-[#EAF0FD] px-2.5 py-1 text-xs font-bold text-[#1A3FAF]">
          {moreCount} more
        </span>
      </div>

      {others.map((job) => (
        <Link
          key={job.id}
          href={`/dashboard/jobs/${job.id}`}
          className="group -mx-3 flex items-center gap-3 rounded-[14px] p-3 text-[#0F172A] no-underline hover:bg-[#F6F8FC]"
        >
          <CompanyLogo
            name={companyName}
            logo={companyLogo ?? job.company.logo}
            className="h-10 w-10 rounded-xl border border-[#EEF1F6]"
            textClassName="text-xs"
            imagePadding="p-1"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-[15px] font-bold">{job.jobTitle.title}</span>
            <span className="truncate text-[13px] text-[#5B6478]">
              {job.is_remote ? "Remote" : `${job.city} · On-site`}
            </span>
          </span>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-[#5B6478] transition-transform group-hover:translate-x-[3px]"
            strokeWidth={2.2}
            aria-hidden="true"
          />
        </Link>
      ))}

      <Link
        href={companyJobsHref(companyName, companyId)}
        className="mt-2.5 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#F4F6FA] text-sm font-bold text-[#2451D6] no-underline hover:bg-[#EAF0FD]"
      >
        See all jobs at {companyName}
        <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
      </Link>
    </section>
  );
}

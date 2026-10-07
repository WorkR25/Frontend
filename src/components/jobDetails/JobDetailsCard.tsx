"use client";

import Link from "next/link";
import { Bookmark, Building2, ExternalLink, MapPin, Share2, Users } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { timeAgo } from "@/utils/getTime";
import { companyJobsHref } from "./companyJobsHref";
import JobSpecification, { JobSpecificationProps } from "./JobSpecification";
import useJobActions from "./useJobActions";

type JobDetailsCardProps = {
  jobId: number;
  img: string;
  title: string;
  companyName: string;
  companyId?: number;
  city: string;
  country?: string;
  industry?: string;
  created_at: Date;
  apply_link: string;
  isRemote: boolean;
  specification: JobSpecificationProps;
};

export default function JobDetailsCard({
  jobId,
  img,
  title,
  companyName,
  companyId,
  city,
  industry,
  created_at,
  apply_link,
  specification,
}: JobDetailsCardProps) {
  const { apply, requestReferral, share, save } = useJobActions(jobId, apply_link, { title, companyName, companyLogo: img });
  const isRemote = city?.trim().toLowerCase() === "remote";

  return (
    <section className="overflow-hidden rounded-3xl border border-[#E4E8F0] bg-white shadow-[0_10px_30px_rgba(16,32,80,0.05)]">
      <div className="relative overflow-hidden border-b border-[#DFE7FA] bg-[#EEF3FF] bg-[radial-gradient(#CBD7F5_1.2px,transparent_1.2px)] bg-[size:20px_20px] p-5 sm:p-8">
        <span aria-hidden="true" className="absolute -right-[60px] -top-[90px] h-[300px] w-[300px] rounded-full bg-[#DCE7FC]" />
        <span aria-hidden="true" className="absolute -bottom-[120px] right-[180px] h-[200px] w-[200px] rounded-full bg-[#E6EDFD]" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="flex min-w-0 flex-wrap items-center gap-5 sm:gap-6">
            <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[22px] bg-white shadow-[0_12px_28px_rgba(16,32,80,0.12)] sm:h-[92px] sm:w-[92px] sm:rounded-3xl">
              <CompanyLogo
                name={companyName}
                logo={img}
                className="h-[56px] w-[56px] rounded-2xl sm:h-[68px] sm:w-[68px] sm:rounded-[18px]"
                textClassName="text-xl sm:text-2xl"
                imagePadding="p-1"
              />
            </span>

            <div className="flex min-w-0 flex-col gap-2.5">
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-[#BFE8D2] bg-white px-[11px] py-[5px] text-xs font-bold text-[#11643C]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FA463]" />
                  Posted {timeAgo(String(created_at))}
                </span>
                <span className="rounded-full border border-[#D5DEF2] bg-white px-[11px] py-[5px] text-xs font-bold text-[#1A3FAF]">
                  Referral available
                </span>
              </div>
              <h1 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-[38px]">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[15px] font-semibold text-[#475066]">
                <Link
                  href={companyJobsHref(companyName, companyId)}
                  className="flex items-center gap-1.5 font-bold text-[#2451D6] no-underline hover:text-[#1A3FAF]"
                >
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {companyName}
                </Link>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {isRemote ? "Remote" : city}
                </span>
                {industry && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    {industry}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
            <button
              type="button"
              aria-label="Save job"
              title="Save job"
              onClick={save}
              className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-[14px] border border-[#D5DEF2] bg-white text-[#344054] hover:bg-[#EEF2FA]"
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Share job"
              title="Share job"
              onClick={share}
              className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-[14px] border border-[#D5DEF2] bg-white text-[#344054] hover:bg-[#EEF2FA]"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={requestReferral}
              className="h-[50px] flex-1 cursor-pointer rounded-[14px] border-[1.5px] border-[#B9CBF3] bg-white px-[22px] text-[15px] font-bold text-[#1A3FAF] transition-colors hover:border-[#2451D6] hover:bg-[#F6F9FF] sm:flex-none"
            >
              Request referral
            </button>
            <button
              type="button"
              onClick={apply}
              className="flex h-[50px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#2451D6] px-[26px] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(36,81,214,0.32)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#1A3FAF] sm:flex-none"
            >
              Apply now
              <ExternalLink className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <JobSpecification {...specification} />
    </section>
  );
}

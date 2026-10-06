"use client";
import Link from "next/link";
import { ArrowRight, Briefcase, Clock, MapPin, Laptop } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { JobCardParams } from "@/types/JobCard";
import { cn } from "@/utils/cn";
import { getCompanyTint } from "@/utils/companyBrand";
import { SHOW_JOB_SKILLS } from "@/utils/featureFlags";
import { timeAgo } from "@/utils/getTime";

const NEW_JOB_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_SKILLS_ON_CARD = 3;

export default function JobCard({
  id,
  img,
  title,
  company,
  employmentType,
  city,
  className,
  created_at,
  skills = [],
  isRemote,
}: JobCardParams) {
  const tint = getCompanyTint(company);
  const remote = isRemote ?? city?.trim().toLowerCase() === "remote";
  const isNew =
    !!created_at && Date.now() - new Date(created_at).getTime() < NEW_JOB_WINDOW_MS;
  const visibleSkills = skills.filter(Boolean).slice(0, MAX_SKILLS_ON_CARD);
  const extraSkills = skills.filter(Boolean).length - visibleSkills.length;

  return (
    <Link
      href={`/dashboard/jobs/${id}`}
      className={cn(
        "group relative flex w-full flex-col gap-4 overflow-hidden rounded-[20px] border border-[#E4E8F0] bg-white p-[22px] text-[#0F172A] no-underline",
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-[3px] hover:border-[#B9CBF3] hover:shadow-[0_16px_36px_rgba(16,32,80,0.10)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2451D6]/25",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-[120px] w-[120px] rounded-full opacity-70"
        style={{ background: tint.bg }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <CompanyLogo
          name={company}
          logo={img}
          className="h-[52px] w-[52px] rounded-2xl border-[3px] border-white shadow-[0_4px_12px_rgba(16,32,80,0.10)]"
          textClassName="text-[15px]"
          imagePadding="p-1.5"
        />
        {isNew && (
          <span className="flex items-center gap-1.5 rounded-full border border-[#BFE8D2] bg-white px-2.5 py-[5px] text-xs font-bold text-[#11643C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1FA463]" />
            New
          </span>
        )}
      </div>

      <div className="relative">
        <h3 className="text-lg font-extrabold leading-[1.3] tracking-[-0.015em]">{title}</h3>
        <p className="mt-1 text-sm font-semibold text-[#5B6478]">{company}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-[13px] font-semibold">
        {!remote && city && (
          <span className="flex items-center gap-1.5 rounded-lg bg-[#EAF0FD] px-2.5 py-1.5 text-[#1A3FAF]">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {city}
          </span>
        )}
        <span className="flex items-center gap-1.5 rounded-lg bg-[#E3F6EC] px-2.5 py-1.5 text-[#11643C]">
          <Laptop className="h-3.5 w-3.5" aria-hidden="true" />
          {remote ? "Remote" : "On-site"}
        </span>
        {employmentType && (
          <span className="flex items-center gap-1.5 rounded-lg bg-[#FFF4E0] px-2.5 py-1.5 text-[#8A4B00]">
            <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
            {employmentType}
          </span>
        )}
      </div>

      {/* Skills: built, hidden until SHOW_JOB_SKILLS is enabled. */}
      {visibleSkills.length > 0 && (
        <div className={cn("flex flex-wrap gap-1.5", !SHOW_JOB_SKILLS && "hidden")}>
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[#E4E8F0] px-2.5 py-1 text-xs font-semibold text-[#344054]"
            >
              {skill}
            </span>
          ))}
          {extraSkills > 0 && (
            <span className="rounded-full bg-[#F1F4F9] px-2.5 py-1 text-xs font-semibold text-[#5B6478]">
              +{extraSkills} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-dashed border-[#E1E6EF] pt-4 text-[13px]">
        <span className="flex items-center gap-1.5 font-medium text-[#5B6478]">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {created_at ? timeAgo(String(created_at)) : "Recently"}
        </span>
        <span className="flex items-center gap-1.5 rounded-[10px] bg-[#2451D6] px-3.5 py-2 font-bold text-white transition-[gap,background-color] duration-200 group-hover:gap-2.5 group-hover:bg-[#1A3FAF]">
          View &amp; apply
          <ArrowRight className="h-[15px] w-[15px]" strokeWidth={2.4} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

"use client";

import {
  Briefcase,
  Copy,
  FileText,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
  SearchX,
} from "lucide-react";
import { toast } from "sonner";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { cn } from "@/utils/cn";
import { getCompanyMonogram, getCompanyTint } from "@/utils/companyBrand";
import { timeAgo } from "@/utils/getTime";

export type CandidateType = "Student" | "Working Professional";

type Candidate = GetUserResponseType & { created_at?: string; createdAt?: string };

function copy(value: string, label: string) {
  navigator.clipboard
    ?.writeText(value)
    .then(() => toast.success(`${label} copied`))
    .catch(() => toast.error(`Couldn’t copy ${label.toLowerCase()}`));
}

function formatCtc(ctc: string | null | undefined) {
  if (!ctc) return null;
  const t = String(ctc).trim();
  return /^\d+(\.\d+)?$/.test(t) ? `${t} LPA` : t;
}

function ContactLine({
  icon,
  value,
  href,
  label,
}: {
  icon: React.ReactNode;
  value?: string | null;
  href: string;
  label: string;
}) {
  if (!value) return <span className="text-sm text-[#A3ACBD]">No {label.toLowerCase()}</span>;
  return (
    <span className="group/line flex min-w-0 items-center gap-2 text-sm">
      <span className="shrink-0 text-[#8A93A6]">{icon}</span>
      <a href={href} className="truncate font-medium text-[#0F172A] no-underline hover:text-[#2451D6]">
        {value}
      </a>
      <button
        type="button"
        aria-label={`Copy ${label.toLowerCase()}`}
        onClick={() => copy(value, label)}
        className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#8A93A6] opacity-0 transition-opacity hover:bg-[#EEF2FA] hover:text-[#2451D6] focus-visible:opacity-100 group-hover/line:opacity-100"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

const GRID_STUDENT = "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1fr)_110px_96px]";
const GRID_WORKING = "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1fr)_96px]";

export function CandidateTableHeader({ type }: { type: CandidateType }) {
  const working = type === "Working Professional";
  return (
    <div
      className={cn(
        "hidden gap-4 px-5 pb-2 text-xs font-bold tracking-[0.08em] text-[#5B6478] md:grid",
        working ? GRID_WORKING : GRID_STUDENT,
      )}
    >
      <span>CANDIDATE</span>
      <span>CONTACT</span>
      <span>{working ? "CURRENT ROLE" : "DOMAIN"}</span>
      <span>{working ? "DOMAIN" : "GRADUATION"}</span>
      <span className="text-right">LINKS</span>
    </div>
  );
}

export function CandidateRow({ user, type }: { user: Candidate; type: CandidateType }) {
  const working = type === "Working Professional";
  const name = user.fullName?.trim() || "Unnamed";
  const tint = getCompanyTint(name);
  const joinedAt = user.created_at ?? user.createdAt;
  const domain = user.profile?.domain;
  const ctc = formatCtc(user.profile?.currentCtc);
  const years = user.profile?.yearsOfExperience;

  return (
    <article
      className={cn(
        "grid grid-cols-1 items-center gap-3 rounded-2xl border border-[#E4E8F0] bg-white p-4 transition-colors hover:border-[#C5D3F2] md:gap-4 md:px-5",
        working ? GRID_WORKING : GRID_STUDENT,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold"
          style={{ background: tint.bg, color: tint.fg }}
          aria-hidden="true"
        >
          {getCompanyMonogram(name)}
        </span>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-[#0F172A]">{name}</div>
          <div className="text-xs text-[#5B6478]">
            {joinedAt ? `Joined ${timeAgo(String(joinedAt))}` : `ID #${user.id}`}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <ContactLine icon={<Mail className="h-3.5 w-3.5" />} value={user.email} href={`mailto:${user.email}`} label="Email" />
        <ContactLine icon={<Phone className="h-3.5 w-3.5" />} value={user.phoneNo} href={`tel:${user.phoneNo}`} label="Phone" />
      </div>

      {working ? (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 truncate text-sm font-semibold text-[#0F172A]">
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-[#8A93A6]" aria-hidden="true" />
            <span className="truncate">{user.profile?.currentCompany || "Company not added"}</span>
          </div>
          <div className="mt-0.5 text-xs text-[#5B6478]">
            {[ctc && `CTC ${ctc}`, years != null && `${years} yr${years === 1 ? "" : "s"} exp`]
              .filter(Boolean)
              .join(" · ") || "CTC and experience not added"}
          </div>
        </div>
      ) : (
        <div className="min-w-0">
          {domain ? (
            <span className="inline-block max-w-full truncate rounded-full bg-[#EAF0FD] px-2.5 py-1 text-xs font-bold text-[#1A3FAF]">
              {domain}
            </span>
          ) : (
            <span className="text-sm text-[#A3ACBD]">Not added</span>
          )}
        </div>
      )}

      {working ? (
        <div className="min-w-0">
          {domain ? (
            <span className="inline-block max-w-full truncate rounded-full bg-[#EAF0FD] px-2.5 py-1 text-xs font-bold text-[#1A3FAF]">
              {domain}
            </span>
          ) : (
            <span className="text-sm text-[#A3ACBD]">Not added</span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0F172A]">
          <GraduationCap className="h-4 w-4 text-[#8A93A6]" aria-hidden="true" />
          {user.graduationYear ?? <span className="font-normal text-[#A3ACBD]">—</span>}
        </div>
      )}

      <div className="flex items-center gap-1.5 md:justify-end">
        {user.profile?.resumeUrl ? (
          <a
            href={user.profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open resume"
            aria-label={`Open ${name}'s resume`}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E4E8F0] text-[#344054] hover:border-[#2451D6] hover:text-[#2451D6]"
          >
            <FileText className="h-4 w-4" />
          </a>
        ) : (
          <span title="No resume" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-dashed border-[#E4E8F0] text-[#C9D0DC]">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        {user.profile?.linkedinUrl ? (
          <a
            href={user.profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open LinkedIn"
            aria-label={`Open ${name}'s LinkedIn`}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E4E8F0] text-[#344054] hover:border-[#2451D6] hover:text-[#2451D6]"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        ) : (
          <span title="No LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-dashed border-[#E4E8F0] text-[#C9D0DC]">
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </article>
  );
}

export function CandidateRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-[#E4E8F0] bg-white p-4 md:px-5">
      <div className="h-10 w-10 rounded-full bg-[#EEF1F6]" />
      <div className="flex-1">
        <div className="h-3.5 w-40 rounded bg-[#EEF1F6]" />
        <div className="mt-2 h-3 w-24 rounded bg-[#EEF1F6]" />
      </div>
      <div className="hidden h-3.5 w-56 rounded bg-[#EEF1F6] md:block" />
      <div className="hidden h-6 w-28 rounded-full bg-[#EEF1F6] md:block" />
    </div>
  );
}

export function CandidatesEmpty({ type }: { type: CandidateType }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#C9D2E3] bg-white px-6 py-14 text-center">
      <SearchX className="h-7 w-7 text-[#8A93A6]" aria-hidden="true" />
      <p className="text-base font-bold text-[#0F172A]">
        No {type === "Student" ? "students" : "working professionals"} yet
      </p>
      <p className="text-sm text-[#5B6478]">New sign-ups will show up here.</p>
    </div>
  );
}

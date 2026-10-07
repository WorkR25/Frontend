import { BriefcaseBusiness, ExternalLink, FileText, GraduationCap, Layers, Linkedin, Mail, Phone } from "lucide-react";
import { ReactNode } from "react";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { getInitials } from "@/utils/profileChecklist";

function Chip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-[#F1F4F9] px-3 py-1.5 text-[13px] font-semibold text-[#344054]">
      {icon}
      {children}
    </span>
  );
}

const LINK =
  "flex h-10 items-center gap-2 rounded-xl border border-[#E4E8F0] bg-white px-3.5 text-sm font-bold text-[#0F172A] no-underline hover:bg-[#F4F6FA]";

/** Profile header: avatar, name, contact line and quick facts. */
export default function ProfileHero({ user }: { user: GetUserResponseType }) {
  const p = user.profile;
  const working = p?.details === "Working Professional";
  const status = working
    ? p?.currentCompany
      ? `Working at ${p.currentCompany}`
      : "Working professional"
    : p?.details === "Student"
      ? "Student"
      : null;

  return (
    <section className="overflow-hidden rounded-[22px] border border-[#E4E8F0] bg-white">
      <div className="h-24 bg-[#142463] bg-[radial-gradient(rgba(255,255,255,0.1)_1.2px,transparent_1.2px)] bg-[size:22px_22px] sm:h-28" />
      <div className="flex flex-wrap items-end justify-between gap-4 px-5 pb-6 sm:px-7">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
          <span className="-mt-11 flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#EAF0FD] text-[28px] font-extrabold text-[#1A3FAF] shadow-[0_6px_16px_rgba(15,23,42,0.12)] sm:-mt-12">
            {getInitials(user.fullName)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold text-[#0F172A]">{user.fullName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#5B6478]">
              <span className="flex min-w-0 items-center gap-1.5">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{user.email}</span>
              </span>
              {user.phoneNo && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {user.phoneNo}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {p?.linkedinUrl && (
            <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              <Linkedin className="h-4 w-4 text-[#0A66C2]" aria-hidden="true" />
              LinkedIn
            </a>
          )}
          {p?.resumeUrl && (
            <a href={p.resumeUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              <FileText className="h-4 w-4 text-[#C2362B]" aria-hidden="true" />
              Resume
              <ExternalLink className="h-3.5 w-3.5 text-[#8A93A6]" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {(status || p?.domain || user.graduationYear) && (
        <div className="flex flex-wrap gap-2 border-t border-[#EEF1F6] px-5 py-4 sm:px-7">
          {status && (
            <Chip
              icon={
                working ? (
                  <BriefcaseBusiness className="h-3.5 w-3.5 text-[#2451D6]" aria-hidden="true" />
                ) : (
                  <GraduationCap className="h-3.5 w-3.5 text-[#2451D6]" aria-hidden="true" />
                )
              }
            >
              {status}
            </Chip>
          )}
          {p?.domain && (
            <Chip icon={<Layers className="h-3.5 w-3.5 text-[#2451D6]" aria-hidden="true" />}>{p.domain}</Chip>
          )}
          {user.graduationYear && (
            <Chip icon={<GraduationCap className="h-3.5 w-3.5 text-[#2451D6]" aria-hidden="true" />}>
              Class of {user.graduationYear}
            </Chip>
          )}
        </div>
      )}
    </section>
  );
}

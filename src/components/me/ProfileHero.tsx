import { BriefcaseBusiness, ExternalLink, FileText, GraduationCap, Layers, Linkedin, Mail, Phone } from "lucide-react";
import { ReactNode } from "react";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { getInitials } from "@/utils/profileChecklist";

function Chip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-[#E4E8F0] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#344054]">
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
    <section className="relative overflow-hidden rounded-[22px] border border-[#E4E8F0] bg-white">
      {/* Soft brand glow instead of a solid banner */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_140%_at_100%_0%,#EAF0FD_0%,rgba(234,240,253,0)_55%)]"
        aria-hidden="true"
      />
      <div className="relative flex flex-wrap items-center justify-between gap-5 p-5 sm:p-7">
        <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
          <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#2451D6] text-2xl font-extrabold text-white ring-4 ring-[#EAF0FD] sm:h-20 sm:w-20 sm:text-[26px]">
            {getInitials(user.fullName)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold text-[#0F172A] sm:text-2xl">{user.fullName}</h1>
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
            {(status || p?.domain || user.graduationYear) && (
              <div className="mt-3 flex flex-wrap gap-2">
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
          </div>
        </div>

        {(p?.linkedinUrl || p?.resumeUrl) && (
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
        )}
      </div>
    </section>
  );
}

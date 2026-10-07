import {
  BellRing,
  Briefcase,
  Check,
  Clock3,
  ExternalLink,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { domainOptions } from "@/utils/signup.utils";

/*
 * Marketing panel beside the login/signup forms: a small, illustrative collage of the
 * product (job card, search, profile strength, application sent). All names are made up
 * and no figures are claimed; nothing here is real data.
 */

const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

function Avatar({ letter, bg, fg }: { letter: string; bg: string; fg: string }) {
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[11px] font-extrabold"
      style={{ background: bg, color: fg }}
    >
      {letter}
    </span>
  );
}

export default function AuthHero() {
  const domains = domainOptions.filter((d) => d !== "Others");

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-[#101C52] text-white"
      aria-hidden="false"
    >
      {/* Background: dot grid, two glows and soft rings behind the collage */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1.2px,transparent_1.2px)] bg-[size:22px_22px]" />
      <div className="pointer-events-none absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(46,98,255,0.55)_0%,rgba(46,98,255,0)_68%)]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(91,228,155,0.18)_0%,rgba(91,228,155,0)_70%)]" />

      {/* Copy */}
      <div className="relative z-10 px-10 pt-10 xl:px-14 xl:pt-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-bold tracking-[0.08em] text-[#C9D3F0]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5BE49B] opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5BE49B]" />
          </span>
          NEW JOBS ADDED DAILY
        </span>
        <h2 className="mt-5 max-w-[520px] text-[40px] font-extrabold leading-[1.06] tracking-[-0.025em] xl:text-[48px]">
          Find your next role,{" "}
          <span className="bg-[linear-gradient(90deg,#8FB3FF_0%,#5BE49B_100%)] bg-clip-text text-transparent">
            faster.
          </span>
        </h2>
        <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-[#C9D3F0]">
          Hand-picked openings from product companies, one profile for every application, and referrals
          from people who work there.
        </p>
      </div>

      {/* Product collage */}
      <div className="relative z-10 flex min-h-[440px] flex-1 items-center justify-center px-8" aria-hidden="true">
        <div className="relative flex h-[440px] w-full max-w-[580px] items-center justify-center">
        {/* rings */}
        <div className="pointer-events-none absolute h-[440px] w-[440px] rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute h-[300px] w-[300px] rounded-full border border-white/[0.08]" />

        {/* Main job card */}
        <div className="relative w-full max-w-[360px] rounded-[22px] bg-white p-5 text-[#0F172A] shadow-[0_30px_70px_rgba(3,8,30,0.55)]">
          <div className="flex items-start gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EAF0FD] text-[15px] font-extrabold text-[#1A3FAF]">
              Np
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E3F6EC] px-2 py-0.5 text-[11px] font-bold text-[#11643C]">
                  ● Posted today
                </span>
              </div>
              <div className="mt-1.5 truncate text-[17px] font-extrabold tracking-[-0.01em]">
                Senior Frontend Engineer
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[13px] text-[#5B6478]">
                Northpeak Labs <span className="text-[#C3CAD7]">·</span>
                <MapPin className="h-3.5 w-3.5" /> Bengaluru
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="flex items-center gap-1 rounded-lg bg-[#F1F4F9] px-2.5 py-1 text-xs font-semibold text-[#344054]">
              <Briefcase className="h-3.5 w-3.5 text-[#2451D6]" /> Full time
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-[#F1F4F9] px-2.5 py-1 text-xs font-semibold text-[#344054]">
              <Clock3 className="h-3.5 w-3.5 text-[#2451D6]" /> 3–5 yrs
            </span>
            <span className="rounded-lg bg-[#F1EDFF] px-2.5 py-1 text-xs font-semibold text-[#5B3CC4]">React</span>
            <span className="rounded-lg bg-[#F1EDFF] px-2.5 py-1 text-xs font-semibold text-[#5B3CC4]">TypeScript</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EEF1F6] pt-4">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <Avatar letter="R" bg="#FFE7D6" fg="#9A3D0A" />
                <Avatar letter="K" bg="#E3F6EC" fg="#11643C" />
                <Avatar letter="M" bg="#EAF0FD" fg="#1A3FAF" />
              </div>
              <span className="text-xs font-bold text-[#1A3FAF]">Referral available</span>
            </div>
            <span className="flex items-center gap-1.5 rounded-xl bg-[#2451D6] px-3.5 py-2 text-xs font-bold text-white">
              Apply <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* Floating: search */}
        <div className="animate-bob-slow absolute left-0 top-0 hidden w-[230px] rounded-2xl border border-white/15 bg-[#22337A] p-3 shadow-[0_18px_40px_rgba(3,8,30,0.45)] xl:block">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[13px] font-semibold text-[#0F172A]">
            <Search className="h-4 w-4 text-[#2451D6]" />
            Frontend engineer
            <span className="ml-auto h-4 w-px animate-pulse bg-[#2451D6] motion-reduce:animate-none" />
          </div>
          <div className="mt-2 flex gap-1.5">
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#1A3FAF]">Remote</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white">On-site</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white">Intern</span>
          </div>
        </div>

        {/* Floating: profile strength */}
        <div
          className="animate-bob absolute right-0 top-6 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-[#0F172A] shadow-[0_18px_40px_rgba(3,8,30,0.45)] xl:flex"
          style={{ animationDelay: "-2s" }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r={RING_R} fill="none" stroke="#EEF1F6" strokeWidth="5" />
            <circle
              cx="22"
              cy="22"
              r={RING_R}
              fill="none"
              stroke="#1FA463"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${0.85 * RING_C} ${RING_C}`}
              transform="rotate(-90 22 22)"
            />
          </svg>
          <div>
            <div className="text-[11px] font-semibold text-[#5B6478]">Profile strength</div>
            <div className="text-[15px] font-extrabold">Almost there</div>
          </div>
        </div>

        {/* Floating: application sent */}
        <div
          className="animate-bob absolute bottom-6 left-0 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-[#0F172A] shadow-[0_18px_40px_rgba(3,8,30,0.45)] xl:flex"
          style={{ animationDelay: "-4s" }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1FA463] text-white">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div>
            <div className="text-[13px] font-extrabold">Application sent</div>
            <div className="text-[11px] text-[#5B6478]">Backend Engineer II · Remote</div>
          </div>
        </div>

        {/* Floating: referral request */}
        <div
          className="animate-bob-slow absolute bottom-0 right-0 hidden items-center gap-2.5 rounded-2xl border border-white/15 bg-[#22337A] p-3 pr-4 shadow-[0_18px_40px_rgba(3,8,30,0.45)] xl:flex"
          style={{ animationDelay: "-3s" }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFB547] text-[#4A2800]">
            <BellRing className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[13px] font-extrabold">New role matches you</div>
            <div className="text-[11px] text-[#C9D3F0]">Data Engineering · Hyderabad</div>
          </div>
        </div>
        </div>
      </div>

      {/* Domains marquee */}
      <div className="relative z-10 border-t border-white/10 bg-white/[0.03] py-5">
        <div className="mb-3 flex items-center gap-2 px-10 text-xs font-bold tracking-[0.08em] text-[#8FA0D0] xl:px-14">
          <Sparkles className="h-3.5 w-3.5" /> ROLES ACROSS
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="animate-marquee flex w-max gap-2.5 px-10">
            {[...domains, ...domains].map((d, i) => (
              <span
                key={`${d}-${i}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3.5 py-2 text-[13px] font-semibold text-[#DCE3F7]"
              >
                <Users className="h-3.5 w-3.5 text-[#8FB3FF]" />
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

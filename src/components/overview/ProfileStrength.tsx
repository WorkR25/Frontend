"use client";

import { Check, LogIn, Pencil } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { getCompletionPercentage } from "@/utils/getCompletionPercentage";

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Profile items in the order we nudge people to fill them in. */
function getChecklist(user: GetUserResponseType) {
  const p = user.profile ?? ({} as GetUserResponseType["profile"]);
  const working = p.details === "Working Professional";
  const items = [
    { label: "Add your resume", done: !!p.resumeUrl },
    { label: "Add your skills", done: (user.skills?.length ?? 0) > 0 },
    { label: "Add your LinkedIn profile", done: !!p.linkedinUrl },
    { label: "Choose your domain", done: !!p.domain },
    { label: "Write a short bio", done: !!p.bio },
    { label: "Add your graduation year", done: !!user.graduationYear },
    { label: "Add your phone number", done: !!user.phoneNo },
  ];
  if (working) {
    items.push(
      { label: "Add your current company", done: !!p.currentCompany },
      { label: "Add your current CTC", done: p.currentCtc != null },
      { label: "Add your years of experience", done: !!p.yearsOfExperience },
    );
  }
  return items;
}

const CARD =
  "flex flex-col gap-[18px] rounded-[22px] bg-[#142463] bg-[radial-gradient(rgba(255,255,255,0.09)_1.2px,transparent_1.2px)] bg-[size:22px_22px] p-6 text-white";

export default function ProfileStrength({ user, loading }: { user?: GetUserResponseType | null; loading: boolean }) {
  const pathname = usePathname();

  if (loading) {
    return <div className={`${CARD} h-[340px] animate-pulse`} aria-busy="true" />;
  }

  if (!user) {
    return (
      <section className={CARD}>
        <div className="text-lg font-extrabold">Build your WorkR profile</div>
        <p className="text-sm leading-relaxed text-[#C9D3F0]">
          Log in to apply for jobs, request referrals and get noticed by recruiters.
        </p>
        <Link
          href={`/login?returnUrl=${encodeURIComponent(pathname)}`}
          className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-white text-sm font-extrabold text-[#142463] no-underline hover:bg-[#E6ECFF]"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Log in or sign up
        </Link>
      </section>
    );
  }

  const percent = getCompletionPercentage(user);
  const checklist = getChecklist(user);
  const done = checklist.filter((i) => i.done);
  const todo = checklist.filter((i) => !i.done);
  // Show up to three items: the most useful missing ones, topped up with a completed one for context.
  const shown = [...done.slice(0, Math.max(0, 3 - todo.length)), ...todo.slice(0, 3)].slice(0, 3);
  const complete = todo.length === 0;

  return (
    <section className={CARD}>
      <div className="flex items-center gap-[18px]">
        <div className="relative h-[92px] w-[92px] shrink-0">
          <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true">
            <circle cx="46" cy="46" r={RADIUS} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="10" />
            <circle
              cx="46"
              cy="46"
              r={RADIUS}
              fill="none"
              stroke="#5BE49B"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(percent / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              transform="rotate(-90 46 46)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[22px] font-extrabold">
            {percent}%
          </div>
        </div>
        <div>
          <h2 className="text-lg font-extrabold">Profile strength</h2>
          <p className="mt-1 text-[13px] leading-normal text-[#C9D3F0]">
            {complete
              ? "Your profile is complete. Recruiters can see everything about you."
              : "A complete profile gets you noticed faster by recruiters."}
          </p>
        </div>
      </div>

      {!complete && (
        <div className="flex flex-col gap-2.5 rounded-[14px] bg-white/[0.08] p-3.5">
          <div className="text-xs font-bold tracking-[0.08em] text-[#C9D3F0]">NEXT STEPS</div>
          <ul className="flex flex-col gap-2.5">
            {shown.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5 text-sm">
                {item.done ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1FA463]">
                    <Check className="h-3 w-3" strokeWidth={3.2} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="h-5 w-5 rounded-full border-[1.5px] border-white/50" aria-hidden="true" />
                )}
                <span className={item.done ? "text-[#C9D3F0] line-through" : "font-semibold"}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/dashboard/me"
        className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-white text-sm font-extrabold text-[#142463] no-underline hover:bg-[#E6ECFF]"
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
        {complete ? "View my profile" : "Complete my profile"}
      </Link>
    </section>
  );
}

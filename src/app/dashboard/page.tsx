"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import DashboardTopbarHamburgerMenu from "@/components/dashboard/DashboardTopbarHamburgerMenu";
import DashboardTopbarLogoutButton from "@/components/dashboard/DashboardTopbarLogoutButton";
import TodayDate from "@/components/dashboard/TodayDate";
import {
  ApplicationsComingSoon,
  InvitesComingSoon,
  RecruiterViewsComingSoon,
  SavedJobsComingSoon,
  TipsComingSoon,
} from "@/components/overview/ComingSoonCards";
import JobsForYou from "@/components/overview/JobsForYou";
import ProfileStrength from "@/components/overview/ProfileStrength";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useGetUser from "@/utils/useGetUser";

function greetingFor(date: Date) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Page() {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const [greeting, setGreeting] = useState<string | null>(null);
  // Login state is only known in the browser, so render user-specific parts after mount
  // (avoids a server/client mismatch).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) dispatch(setAuthJwtToken(token));
    // Rendered in the browser so it uses the visitor's local time.
    setGreeting(greetingFor(new Date()));
    setMounted(true);
  }, [dispatch]);

  const { data: userData, isLoading } = useGetUser(jwtToken);
  const user = mounted ? userData : undefined;
  const loadingUser = !mounted || isLoading;
  const firstName = user?.fullName?.trim().split(/\s+/)[0];

  return (
    <div className="h-full overflow-y-auto bg-[#F4F6FA] font-plus-jakarta text-[#0F172A]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[15px] font-medium text-[#5B6478]">
            <Suspense fallback={null}>
              <DashboardTopbarHamburgerMenu />
            </Suspense>
            <span>
              Dashboard <span className="mx-1.5 text-[#A3ACBD]">/</span>{" "}
              <span className="font-semibold text-[#0F172A]">Overview</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <TodayDate />
            <DashboardTopbarLogoutButton />
          </div>
        </header>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="min-h-[36px] text-[26px] font-extrabold tracking-[-0.03em] sm:text-[30px]">
              {loadingUser ? "\u00A0" : user ? `${greeting ?? "Hello"}, ${firstName}` : "Welcome to WorkR"}
            </h1>
            <p className="mt-1.5 text-[15px] text-[#5B6478]">
              {loadingUser
                ? "\u00A0"
                : user
                  ? "Here’s your job search at a glance."
                  : "Find your next role at a top product company."}
            </p>
          </div>
          <Link
            href="/dashboard/jobs"
            className="flex h-11 items-center gap-2 rounded-xl bg-[#2451D6] px-[18px] text-sm font-bold text-white no-underline shadow-[0_8px_18px_rgba(36,81,214,0.28)] hover:bg-[#1A3FAF]"
          >
            <Search className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
            Explore jobs
          </Link>
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-6">
            {/* Profile first on small screens. */}
            <div className="lg:hidden">
              <ProfileStrength user={user} loading={loadingUser} />
            </div>
            <ApplicationsComingSoon />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
              <SavedJobsComingSoon />
              <InvitesComingSoon />
            </div>
            <JobsForYou />
          </div>

          <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-6">
            <div className="hidden lg:block">
              <ProfileStrength user={user} loading={loadingUser} />
            </div>
            <RecruiterViewsComingSoon />
            <TipsComingSoon />
          </aside>
        </div>
      </div>
    </div>
  );
}

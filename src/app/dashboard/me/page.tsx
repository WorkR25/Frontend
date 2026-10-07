"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import DashboardTopbarHamburgerMenu from "@/components/dashboard/DashboardTopbarHamburgerMenu";
import DashboardTopbarLogoutButton from "@/components/dashboard/DashboardTopbarLogoutButton";
import TodayDate from "@/components/dashboard/TodayDate";
import ProfileChecklist from "@/components/me/ProfileChecklist";
import ProfileHero from "@/components/me/ProfileHero";
import UserDetailForm from "@/components/me/UserDetailForm";
import UserProfileForm from "@/components/me/UserProfileForm";
import UserSkillForm from "@/components/me/UserSkillForm";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useGetUser from "@/utils/useGetUser";

function Skeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading your profile">
      <div className="h-[150px] animate-pulse rounded-[22px] bg-white" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <div className="h-[360px] animate-pulse rounded-[22px] bg-white" />
          <div className="h-[520px] animate-pulse rounded-[22px] bg-white" />
        </div>
        <div className="h-[420px] animate-pulse rounded-[22px] bg-[#142463]/80" />
      </div>
    </div>
  );
}

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    } else {
      router.replace("/login?returnUrl=%2Fdashboard%2Fme");
    }
    setMounted(true);
  }, [dispatch, router]);

  const { data: user, isError } = useGetUser(jwtToken);

  useEffect(() => {
    if (isError) router.replace("/login?returnUrl=%2Fdashboard%2Fme");
  }, [isError, router]);

  const ready = mounted && !!user && !!jwtToken;

  return (
    <div className="h-full overflow-y-auto scroll-smooth bg-[#F4F6FA] font-plus-jakarta text-[#0F172A]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[15px] font-medium text-[#5B6478]">
            <Suspense fallback={null}>
              <DashboardTopbarHamburgerMenu />
            </Suspense>
            <span>
              Dashboard <span className="mx-1.5 text-[#A3ACBD]">/</span>{" "}
              <span className="font-semibold text-[#0F172A]">My profile</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <TodayDate />
            <DashboardTopbarLogoutButton />
          </div>
        </header>

        {!ready ? (
          <Skeleton />
        ) : (
          <>
            <ProfileHero user={user} />
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <aside className="xl:sticky xl:top-6 xl:col-start-2 xl:row-start-1">
                <ProfileChecklist user={user} />
              </aside>
              <div className="flex min-w-0 flex-col gap-6 xl:col-start-1 xl:row-start-1">
                <UserDetailForm user={user} jwtToken={jwtToken} />
                <UserProfileForm user={user} jwtToken={jwtToken} />
                <UserSkillForm user={user} jwtToken={jwtToken} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

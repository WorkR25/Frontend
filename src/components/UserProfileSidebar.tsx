"use client";

import { ChevronsUpDown, LogIn, LogOut, UserRound, UserRoundPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/utils/cn";
import { getCompletionPercentage } from "@/utils/getCompletionPercentage";
import { getInitials } from "@/utils/profileChecklist";
import useGetUser from "@/utils/useGetUser";

const MENU_ITEM =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors";

export default function UserProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const authJwtToken = useAppSelector((state) => state.authJwtToken.value);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const jwt = localStorage.getItem("AuthJwtToken");
    if (jwt) dispatch(setAuthJwtToken(jwt));
    setMounted(true);
  }, [dispatch]);

  const { data, isPending } = useGetUser(authJwtToken);

  // Close the menu on outside click / Esc.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const go = (href: string) => {
    setOpen(false);
    dispatch(isSidebarOpenToogle(false));
    router.push(href);
  };

  const logout = () => {
    setOpen(false);
    localStorage.removeItem("AuthJwtToken");
    dispatch(setAuthJwtToken(""));
    dispatch(isSidebarOpenToogle(false));
    router.replace("/login");
  };

  if (!mounted || (authJwtToken.length > 0 && isPending)) {
    return (
      <div className="flex items-center gap-3 p-1.5" aria-busy="true">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#EEF1F6]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded bg-[#EEF1F6]" />
          <div className="h-2.5 w-full animate-pulse rounded bg-[#EEF1F6]" />
        </div>
      </div>
    );
  }

  if (authJwtToken.length === 0 || !data) {
    const returnUrl = encodeURIComponent(pathname);
    return (
      <div className="p-2">
        <div className="text-sm font-extrabold text-[#0F172A]">Join WorkR</div>
        <p className="mt-0.5 text-xs leading-normal text-[#5B6478]">
          Apply to jobs and get referrals.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => go(`/signup?returnUrl=${returnUrl}`)}
            className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#2451D6] text-sm font-bold text-white hover:bg-[#1A3FAF]"
          >
            <UserRoundPlus className="h-4 w-4" aria-hidden="true" />
            Sign up
          </button>
          <button
            type="button"
            onClick={() => go(`/login?returnUrl=${returnUrl}`)}
            className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-[#D5DEF3] bg-white text-sm font-bold text-[#2451D6] hover:border-[#2451D6]"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Log in
          </button>
        </div>
      </div>
    );
  }

  const percent = data.profile ? getCompletionPercentage(data) : 0;
  const onProfile = pathname === "/dashboard/me";

  return (
    <div ref={rootRef} className="relative">
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute bottom-[calc(100%+10px)] left-0 right-0 z-30 rounded-2xl border border-[#E4E8F0] bg-white p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
        >
          <div className="px-3 pb-3 pt-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#5B6478]">
              <span>Profile strength</span>
              <span className="font-extrabold text-[#0F172A]">{percent}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF1F6]">
              <div
                className={cn("h-full rounded-full", percent === 100 ? "bg-[#1FA463]" : "bg-[#2451D6]")}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <div className="h-px bg-[#EEF1F6]" />
          <div className="pt-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => go("/dashboard/me")}
              className={cn(MENU_ITEM, "text-[#0F172A] hover:bg-[#F4F6FA]")}
            >
              <UserRound className="h-4 w-4 text-[#5B6478]" aria-hidden="true" />
              {percent < 100 ? "Complete my profile" : "My profile"}
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className={cn(MENU_ITEM, "text-[#D92D20] hover:bg-[#FEF3F2]")}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-[#F4F6FA]",
          (open || onProfile) && "bg-[#F4F6FA]",
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF0FD] text-sm font-extrabold text-[#1A3FAF]">
          {getInitials(data.fullName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-[#0F172A]">{data.fullName}</span>
          <span className="block truncate text-xs text-[#5B6478]">{data.email}</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#8A93A6]" aria-hidden="true" />
      </button>
    </div>
  );
}

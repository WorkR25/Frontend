"use client";

import { Check, LogIn, UserRoundPlus, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import CompanyLogo from "@/components/CompanyLogo";
import { LoginRequiredContext } from "@/features/loginRequiredDialogBox/loginRequiredDialogBoxSlice";

interface ConfirmLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
  context?: LoginRequiredContext | null;
}

const PERKS = ["Apply to jobs in one click", "Request referrals from employees", "One profile for every application"];

function copyFor(context?: LoginRequiredContext | null) {
  switch (context?.reason) {
    case "apply":
      return {
        title: "Sign up to apply",
        message: "Create a free WorkR account to apply. It takes a minute, and we'll bring you right back to this job.",
      };
    case "referral":
      return {
        title: "Sign up to request a referral",
        message: "Create a free WorkR account to ask for a referral. We'll bring you right back to this job.",
      };
    default:
      return {
        title: "Log in to continue",
        message: "Create a free WorkR account or log in to keep going.",
      };
  }
}

export default function ConfirmLoginDialog({ isOpen, onClose, onSignup, onLogin, context }: ConfirmLoginDialogProps) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  // Parent passes a new onClose each render; keep the latest without re-running the effect.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    primaryRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      // Keep Tab inside the dialog.
      if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { title, message } = copyFor(context);
  const hasJob = !!context?.jobTitle;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 font-plus-jakarta sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-[#0B1435]/45 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-[440px] overflow-hidden rounded-t-[24px] bg-white shadow-[0_30px_80px_rgba(11,20,53,0.35)] sm:rounded-[24px]"
      >
        <div className="relative bg-[#142463] bg-[radial-gradient(rgba(255,255,255,0.09)_1.2px,transparent_1.2px)] bg-[size:22px_22px] px-6 pb-6 pt-6 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-[18px] w-[18px]" />
          </button>

          {hasJob ? (
            <div className="flex items-center gap-3 pr-10">
              <CompanyLogo
                name={context?.companyName || "Company"}
                logo={context?.companyLogo}
                className="h-12 w-12 shrink-0 rounded-xl bg-white"
              />
              <div className="min-w-0">
                <div className="truncate text-[15px] font-bold">{context?.jobTitle}</div>
                {context?.companyName && (
                  <div className="truncate text-[13px] text-[#C9D3F0]">{context.companyName}</div>
                )}
              </div>
            </div>
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <LogIn className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="px-6 pb-6 pt-5">
          <h2 id={titleId} className="text-[22px] font-extrabold tracking-[-0.01em] text-[#0F172A]">
            {title}
          </h2>
          <p id={descId} className="mt-1.5 text-[15px] leading-relaxed text-[#5B6478]">
            {message}
          </p>

          <ul className="mt-4 flex flex-col gap-2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-sm font-medium text-[#344054]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E3F6EC] text-[#11643C]">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              ref={primaryRef}
              type="button"
              onClick={onSignup}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#2451D6] text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(36,81,214,0.25)] transition-colors hover:bg-[#1A3FAF]"
            >
              <UserRoundPlus className="h-[18px] w-[18px]" aria-hidden="true" />
              Create free account
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-[#D5DEF3] bg-white text-[15px] font-bold text-[#2451D6] transition-colors hover:border-[#2451D6]"
            >
              <LogIn className="h-[18px] w-[18px]" aria-hidden="true" />
              I already have an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

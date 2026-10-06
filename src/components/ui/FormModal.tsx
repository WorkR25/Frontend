"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect, useId, useRef } from "react";
import { cn } from "@/utils/cn";

type FormModalProps = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  /** Tile colours for the header icon, e.g. "bg-[#EAF0FD] text-[#2451D6]". */
  iconTone?: string;
  onClose: () => void;
  /** Blocks Esc / backdrop / ✕ (e.g. while saving). */
  closeDisabled?: boolean;
  /** Tailwind max-width class for the dialog. */
  widthClassName?: string;
  footer: ReactNode;
  children: ReactNode;
};

/** True when `el` is the last-opened dialog on the page (so stacked pop-ups close one at a time). */
function isTopMost(el: HTMLElement | null) {
  const dialogs = document.querySelectorAll('[role="dialog"]');
  return !!el && dialogs[dialogs.length - 1] === el;
}

/**
 * Shared shell for the dashboard's creation pop-ups: dimmed backdrop,
 * header (icon tile, title, subtitle, ✕), scrolling body and a fixed footer.
 * Esc and backdrop clicks close it, but only when it is the top-most dialog.
 */
export default function FormModal({
  title,
  subtitle,
  icon,
  iconTone = "bg-[#EAF0FD] text-[#2451D6]",
  onClose,
  closeDisabled = false,
  widthClassName = "max-w-[880px]",
  footer,
  children,
}: FormModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !closeDisabled && isTopMost(dialogRef.current)) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, closeDisabled]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.48)] font-plus-jakarta sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !closeDisabled && isTopMost(dialogRef.current)) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "flex h-full w-full flex-col overflow-hidden bg-white text-[#0F172A] sm:h-auto sm:max-h-[92vh] sm:rounded-3xl sm:shadow-[0_30px_80px_rgba(15,23,42,0.35)]",
          widthClassName,
        )}
      >
        <div className="flex shrink-0 items-start gap-4 border-b border-[#EEF1F6] px-5 py-5 sm:px-7 sm:py-6">
          <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]", iconTone)}>
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[22px] font-extrabold tracking-[-0.02em]">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm leading-normal text-[#5B6478]">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={closeDisabled}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[#5B6478] hover:bg-[#F1F4F9] disabled:cursor-not-allowed"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F9FC] px-4 py-5 sm:px-7 sm:py-6">{children}</div>

        <div className="shrink-0 border-t border-[#EEF1F6] bg-white px-5 py-4 sm:px-7">{footer}</div>
      </div>
    </div>
  );
}

/** Numbered card used to group fields inside a FormModal. */
export function FormSection({
  step,
  title,
  description,
  badge,
  children,
  className,
}: {
  step?: number;
  title: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[20px] border border-[#E4E8F0] bg-white p-5 sm:p-6", className)}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          {step !== undefined && (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#142463] text-[13px] font-extrabold text-white">
              {step}
            </span>
          )}
          <div>
            <h3 className="text-base font-extrabold leading-7">{title}</h3>
            {description && <p className="text-[13px] text-[#5B6478]">{description}</p>}
          </div>
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

/** Field label with optional required marker and a right-side slot (e.g. "+ Add new"). */
export function FieldLabel({
  htmlFor,
  children,
  required,
  action,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <label htmlFor={htmlFor} className="text-sm font-bold text-[#0F172A]">
        {children}
        {required && <span className="ml-0.5 text-[#D92D20]">*</span>}
      </label>
      {action}
    </div>
  );
}

/** Small "Internal — not shown to candidates" badge. */
export function InternalBadge() {
  return (
    <span className="rounded-full bg-[#F1F4F9] px-2.5 py-1 text-xs font-bold text-[#5B6478]">
      Internal — not shown to candidates
    </span>
  );
}

/** Shared input look for the creation forms. */
export const FORM_INPUT_CLASS =
  "h-[52px] rounded-[14px] border-[1.5px] border-[#E4E8F0] bg-white shadow-none focus-within:border-[#2451D6] focus-within:ring-4 focus-within:ring-[#2451D6]/10 focus:border-[#2451D6] focus:ring-4 focus:ring-[#2451D6]/10";

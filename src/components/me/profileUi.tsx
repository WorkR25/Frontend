"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { forwardRef, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/** White section card used on the profile page. */
export function ProfileCard({
  id,
  icon,
  title,
  description,
  action,
  children,
  footer,
}: {
  id?: string;
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 overflow-hidden rounded-[22px] border border-[#E4E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF0FD] text-[#2451D6]">
            {icon}
          </span>
          <div>
            <h2 className="text-[17px] font-extrabold text-[#0F172A]">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-[#5B6478]">{description}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="px-5 pb-6 pt-5 sm:px-7">{children}</div>
      {footer && (
        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-[#EEF1F6] bg-[#FAFBFD] px-5 py-4 sm:px-7">
          {footer}
        </footer>
      )}
    </section>
  );
}

/** Small uppercase divider label inside a card. */
export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 text-xs font-bold tracking-[0.08em] text-[#8A93A6]">{children}</div>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-[#0F172A]">
        {label}
        {required && <span className="ml-0.5 text-[#D92D20]">*</span>}
      </label>
      {children}
      {error ? (
        <p className="ml-1 mt-1.5 text-[13px] font-medium text-[#D92D20]">{error}</p>
      ) : hint ? (
        <p className="ml-1 mt-1.5 text-[13px] text-[#5B6478]">{hint}</p>
      ) : null}
    </div>
  );
}

const CONTROL =
  "h-[52px] w-full rounded-[14px] border-[1.5px] bg-white text-[15px] font-medium text-[#0F172A] outline-none transition placeholder:font-normal placeholder:text-[#98A2B3] focus:border-[#2451D6] focus:ring-4 focus:ring-[#2451D6]/10 disabled:cursor-not-allowed disabled:bg-[#F7F8FB] disabled:text-[#5B6478]";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  invalid?: boolean;
  suffix?: ReactNode;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { icon, invalid, suffix, className, ...rest },
  ref,
) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2451D6]">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL,
          icon ? "pl-11" : "pl-4",
          suffix ? "pr-14" : "pr-4",
          invalid ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-[#E4E8F0]",
          className,
        )}
        {...rest}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#8A93A6]">
          {suffix}
        </span>
      )}
    </div>
  );
});

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  icon?: ReactNode;
  invalid?: boolean;
  placeholder: string;
  options: string[];
};

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(function SelectInput(
  { icon, invalid, placeholder, options, className, ...rest },
  ref,
) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2451D6]">
          {icon}
        </span>
      )}
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL,
          "cursor-pointer appearance-none pr-11",
          icon ? "pl-11" : "pl-4",
          invalid ? "border-red-300" : "border-[#E4E8F0]",
          className,
        )}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6478]"
        aria-hidden="true"
      />
    </div>
  );
});

/** Footer for a form card: unsaved-changes hint, discard and save. */
export function SaveBar({
  dirty,
  pending,
  onDiscard,
  label,
}: {
  dirty: boolean;
  pending: boolean;
  onDiscard: () => void;
  label: string;
}) {
  return (
    <>
      <span className={cn("mr-auto text-sm", dirty ? "font-semibold text-[#8A4B00]" : "text-[#8A93A6]")}>
        {dirty ? "You have unsaved changes" : "All changes saved"}
      </span>
      {dirty && (
        <button
          type="button"
          onClick={onDiscard}
          disabled={pending}
          className="h-[46px] cursor-pointer rounded-xl px-4 text-sm font-bold text-[#5B6478] hover:bg-[#EEF1F6] disabled:cursor-not-allowed"
        >
          Discard
        </button>
      )}
      <button
        type="submit"
        disabled={!dirty || pending}
        className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1A3FAF] disabled:cursor-not-allowed disabled:bg-[#B9C7EE]"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {pending ? "Saving…" : label}
      </button>
    </>
  );
}

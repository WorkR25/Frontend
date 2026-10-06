"use client";

import { AlertCircle, Check, Info, Loader2, Tag, Type, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import z from "zod";
import LocationCombobox, { LocationMatch } from "@/components/addLocation/LocationCombobox";
import { setShowAddTitleForm } from "@/features/showAddTitleForm/showAddTitleFormSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import useCreateJobTitle from "@/utils/useCreateJobTitle";
import useGetJobTitle from "@/utils/useGetJobTitle";

const AddTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Enter a job title (at least 2 characters)")
    .max(100, "Keep the title under 100 characters"),
});

/** Adapter so the shared search field can use the job-title lookup. */
function useJobTitleLookup(jwtToken: string | null, name: string | undefined) {
  return useGetJobTitle(jwtToken, name ?? null);
}

export default function AddTitleForm() {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const { mutate, isPending } = useCreateJobTitle();

  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [match, setMatch] = useState<LocationMatch>("empty");
  const [added, setAdded] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => dispatch(setShowAddTitleForm(false)), [dispatch]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) close();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [close, isPending]);

  const trimmed = title.trim();
  const alreadyExists = match === "existing";
  const canSubmit = !!trimmed && !alreadyExists && match !== "checking" && !isPending;

  const footerNote = !trimmed
    ? "Type a title to continue"
    : match === "checking"
      ? "Checking existing titles…"
      : alreadyExists
        ? "This title is already available"
        : "Creates a new job title";

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = AddTitleSchema.safeParse({ title });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    if (alreadyExists || match === "checking") return;
    const newTitle = parsed.data.title;
    mutate(
      { authJwtToken: jwtToken, title: newTitle },
      {
        onSuccess: () => {
          setAdded((list) => [newTitle, ...list.filter((t) => t !== newTitle)].slice(0, 6));
          setTitle("");
          dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(15,23,42,0.48)] p-4 font-plus-jakarta"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isPending) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-title-title"
        className="my-auto w-full max-w-[560px] rounded-3xl bg-white text-[#0F172A] shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
      >
        <div className="flex items-start gap-4 px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F1EDFF] text-[#5B3CC4]">
            <Tag className="h-[22px] w-[22px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="add-title-title" className="text-[22px] font-extrabold tracking-[-0.02em]">
              Add a job title
            </h2>
            <p className="mt-1 text-sm leading-normal text-[#5B6478]">
              Add a title so it can be picked when you post a job.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            disabled={isPending}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[#5B6478] hover:bg-[#F1F4F9] disabled:cursor-not-allowed"
          >
            <X className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </button>
        </div>

        <div className="mx-5 mb-5 flex gap-2.5 rounded-xl bg-[#F4F6FA] px-3.5 py-3 text-[13px] leading-normal text-[#475066] sm:mx-7">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2451D6]" strokeWidth={2.2} aria-hidden="true" />
          <span>
            Start typing to check it isn’t already there. Use the common name, e.g.{" "}
            <strong className="font-semibold text-[#0F172A]">Software Engineer II</strong>, not
            company-specific codes.
          </span>
        </div>

        {added.length > 0 && (
          <div
            role="status"
            className="mx-5 mb-5 flex items-center gap-2.5 rounded-xl border border-[#BFE8D2] bg-[#E3F6EC] px-3.5 py-3 text-sm font-semibold text-[#11643C] sm:mx-7"
          >
            <Check className="h-[18px] w-[18px] shrink-0" strokeWidth={2.6} aria-hidden="true" />
            “{added[0]}” added. You can add another one.
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="px-5 sm:px-7">
            <LocationCombobox
              id="job-title"
              label="Job title"
              placeholder="e.g. Senior Frontend Engineer"
              icon={<Type className="h-[18px] w-[18px]" aria-hidden="true" />}
              value={title}
              onChange={(v) => {
                setTitle(v);
                setError(undefined);
              }}
              onMatchChange={setMatch}
              useLookup={useJobTitleLookup}
              jwtToken={jwtToken}
              error={error}
            />
            {alreadyExists && !error && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#8A4B00]">
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                “{trimmed}” already exists — no need to add it again.
              </p>
            )}
          </div>

          {added.length > 0 && (
            <div className="mx-5 mt-5 sm:mx-7">
              <div className="mb-2 text-xs font-bold tracking-[0.08em] text-[#5B6478]">ADDED JUST NOW</div>
              <div className="flex flex-wrap gap-2">
                {added.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 rounded-full border border-[#E4E8F0] bg-[#F4F6FA] px-3 py-1.5 text-[13px] font-semibold text-[#0F172A]"
                  >
                    <Check className="h-3 w-3 text-[#11643C]" strokeWidth={3} aria-hidden="true" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF1F6] px-5 py-[18px] sm:px-7">
            <span className="text-[13px] text-[#5B6478]">{footerNote}</span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={close}
                disabled={isPending}
                className="h-[46px] cursor-pointer rounded-xl border border-[#E4E8F0] bg-white px-[18px] text-sm font-bold text-[#344054] hover:bg-[#F4F6FA] disabled:cursor-not-allowed"
              >
                {added.length > 0 ? "Done" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-[22px] text-sm font-bold text-white shadow-[0_8px_18px_rgba(36,81,214,0.28)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-not-allowed disabled:bg-[#C9D3EE] disabled:shadow-none"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isPending ? "Adding…" : "Add title"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

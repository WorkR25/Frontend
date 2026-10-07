"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Check, CornerDownLeft, Info, Loader2, Plus, Sparkles, X } from "lucide-react";
import { ClipboardEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setShowAddSkillsForm } from "@/features/showAddSkillsForm/showAddSkillsFormSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/utils/cn";
import useCreateSkill from "@/utils/useCreateSkills";
import { useDebounce } from "@/utils/useDebounce";
import useGetSkill from "@/utils/useGetSkill";

const MAX_LEN = 50;

/** Tidy a typed skill: trim and collapse inner spaces. Case is kept (e.g. "Node.js", "AWS"). */
function clean(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_LEN);
}

export default function AddSkill() {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const [queue, setQueue] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);

  const typed = clean(input);
  const term = useDebounce(typed, 300);
  const { data: matches, isFetching } = useGetSkill(jwtToken, term || null);
  const { mutate, isPending } = useCreateSkill();

  const close = useCallback(() => dispatch(setShowAddSkillsForm(false)), [dispatch]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, isPending]);

  const checking = !!typed && (typed !== term || isFetching);
  const results = useMemo(() => (term ? (matches ?? []).slice(0, 8) : []), [matches, term]);
  const exists = !checking && results.some((s) => s.name.toLowerCase() === typed.toLowerCase());
  const queued = queue.some((s) => s.toLowerCase() === typed.toLowerCase());

  const enqueue = (names: string[]) => {
    const fresh: string[] = [];
    let dupes = 0;
    for (const raw of names) {
      const name = clean(raw);
      if (!name) continue;
      const lower = name.toLowerCase();
      if ([...queue, ...fresh].some((q) => q.toLowerCase() === lower)) {
        dupes++;
        continue;
      }
      fresh.push(name);
    }
    if (fresh.length) setQueue((q) => [...q, ...fresh]);
    setNotice(dupes ? `${dupes} duplicate${dupes > 1 ? "s" : ""} skipped.` : null);
    setResult(null);
  };

  const addTyped = () => {
    if (!typed) return;
    if (exists) {
      setNotice(`“${typed}” is already in the skills list.`);
      return;
    }
    if (queued) {
      setNotice(`“${typed}” is already in your list below.`);
      return;
    }
    enqueue([typed]);
    setInput("");
    inputRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTyped();
    } else if (e.key === "Backspace" && !input && queue.length) {
      setQueue((q) => q.slice(0, -1));
    }
  };

  // Pasting "React, Node.js, SQL" (or one per line) adds them all at once.
  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (/[,\n]/.test(text)) {
      e.preventDefault();
      enqueue(text.split(/[,\n]/));
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!queue.length || isPending) return;
    const batch = queue;
    mutate(
      { jwtToken, skills: batch },
      {
        onSuccess: (response) => {
          const created = Array.isArray(response?.data?.data) ? response.data.data.length : batch.length;
          setResult({ created, skipped: Math.max(0, batch.length - created) });
          setAdded((list) => [...batch, ...list.filter((s) => !batch.includes(s))].slice(0, 12));
          setQueue([]);
          setNotice(null);
          // Skill searches are cached; refresh them so the new skills show up everywhere.
          queryClient.invalidateQueries({ queryKey: ["skills"] });
          inputRef.current?.focus();
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-skill-title"
        className="my-auto w-full max-w-[600px] rounded-3xl bg-white text-[#0F172A] shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
      >
        <div className="flex items-start gap-4 px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F1EDFF] text-[#5B3CC4]">
            <Sparkles className="h-[22px] w-[22px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="add-skill-title" className="text-[22px] font-extrabold tracking-[-0.02em]">
              Add skills
            </h2>
            <p className="mt-1 text-sm leading-normal text-[#5B6478]">
              New skills can be tagged on jobs and picked by candidates.
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
            Press <strong className="text-[#0F172A]">Enter</strong> or a comma to add each skill to the list, or paste a
            comma-separated list. Use the usual spelling, e.g. <strong className="text-[#0F172A]">Node.js</strong>,{" "}
            <strong className="text-[#0F172A]">PostgreSQL</strong>. Skills that already exist are skipped.
          </span>
        </div>

        {result && (
          <div
            role="status"
            className="mx-5 mb-5 flex items-center gap-2.5 rounded-xl border border-[#BFE8D2] bg-[#E3F6EC] px-3.5 py-3 text-sm font-semibold text-[#11643C] sm:mx-7"
          >
            <Check className="h-[18px] w-[18px] shrink-0" strokeWidth={2.6} aria-hidden="true" />
            {result.created} skill{result.created === 1 ? "" : "s"} added
            {result.skipped > 0 ? `, ${result.skipped} already existed` : ""}. You can add more.
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="px-5 sm:px-7">
            <label htmlFor="skill-input" className="mb-2 block text-sm font-bold">
              Skill name
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  id="skill-input"
                  type="text"
                  autoComplete="off"
                  value={input}
                  maxLength={MAX_LEN}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setNotice(null);
                  }}
                  onKeyDown={onKeyDown}
                  onPaste={onPaste}
                  placeholder="e.g. TypeScript"
                  aria-describedby="skill-help"
                  aria-invalid={exists || undefined}
                  className={cn(
                    "h-[52px] w-full rounded-[14px] border-[1.5px] bg-white pl-4 pr-11 text-[15px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#98A2B3] focus:ring-4",
                    exists
                      ? "border-[#F5C77A] focus:border-[#E0A43A] focus:ring-[#FFF4E0]"
                      : "border-[#E4E8F0] focus:border-[#2451D6] focus:ring-[#2451D6]/10",
                  )}
                />
                {checking ? (
                  <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#8A93A6]" aria-hidden="true" />
                ) : typed ? (
                  <CornerDownLeft className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A6]" aria-hidden="true" />
                ) : null}
              </div>
              <button
                type="button"
                onClick={addTyped}
                disabled={!typed || exists || queued}
                className="flex h-[52px] shrink-0 cursor-pointer items-center gap-1.5 rounded-[14px] border-[1.5px] border-[#B9CBF3] bg-white px-4 text-sm font-bold text-[#2451D6] hover:border-[#2451D6] disabled:cursor-not-allowed disabled:border-[#E4E8F0] disabled:text-[#A3ACBD]"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add
              </button>
            </div>

            <div id="skill-help" className="mt-2 min-h-[20px] text-xs" aria-live="polite">
              {exists ? (
                <span className="flex items-center gap-1.5 font-medium text-[#8A4B00]">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />“{typed}” already exists, no need to add it.
                </span>
              ) : notice ? (
                <span className="text-[#8A4B00]">{notice}</span>
              ) : null}
            </div>

            {typed && !checking && results.length > 0 && (
              <div className="mt-2">
                <div className="mb-2 text-xs font-bold tracking-[0.08em] text-[#5B6478]">ALREADY IN THE SKILLS LIST</div>
                <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
                  {results.map((s) => (
                    <span
                      key={s.id}
                      className={cn(
                        "rounded-full px-3 py-1 text-[13px] font-semibold",
                        s.name.toLowerCase() === typed.toLowerCase()
                          ? "bg-[#FFF4E0] text-[#8A4B00]"
                          : "bg-[#F1F4F9] text-[#344054]",
                      )}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-bold tracking-[0.08em] text-[#5B6478]">
                <span>TO BE ADDED</span>
                {queue.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setQueue([])}
                    className="cursor-pointer text-xs font-bold normal-case tracking-normal text-[#5B6478] hover:text-[#D92D20]"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {queue.length > 0 ? (
                <ul className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-[#E4E8F0] p-3">
                  {queue.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-1 rounded-full bg-[#EAF0FD] py-1.5 pl-3.5 pr-1.5 text-sm font-semibold text-[#1A3FAF]"
                    >
                      {s}
                      <button
                        type="button"
                        aria-label={`Remove ${s}`}
                        onClick={() => setQueue((q) => q.filter((x) => x !== s))}
                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-[#D5E1FB]"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl border-[1.5px] border-dashed border-[#D5DBE6] bg-[#FAFBFD] px-4 py-5 text-center text-sm text-[#5B6478]">
                  Nothing yet. Type a skill above and press Enter.
                </p>
              )}
            </div>
          </div>

          {added.length > 0 && (
            <div className="mx-5 mt-5 sm:mx-7">
              <div className="mb-2 text-xs font-bold tracking-[0.08em] text-[#5B6478]">ADDED JUST NOW</div>
              <div className="flex flex-wrap gap-2">
                {added.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 rounded-full border border-[#E4E8F0] bg-[#F4F6FA] px-3 py-1.5 text-[13px] font-semibold"
                  >
                    <Check className="h-3 w-3 text-[#11643C]" strokeWidth={3} aria-hidden="true" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF1F6] px-5 py-[18px] sm:px-7">
            <span className="text-[13px] text-[#5B6478]">
              {queue.length ? `${queue.length} skill${queue.length > 1 ? "s" : ""} ready to add` : "Add at least one skill"}
            </span>
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
                disabled={!queue.length || isPending}
                className="flex h-[46px] cursor-pointer items-center gap-2 rounded-xl bg-[#2451D6] px-[22px] text-sm font-bold text-white shadow-[0_8px_18px_rgba(36,81,214,0.28)] transition-colors hover:bg-[#1A3FAF] disabled:cursor-not-allowed disabled:bg-[#C9D3EE] disabled:shadow-none"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isPending
                  ? "Adding…"
                  : queue.length > 1
                    ? `Add ${queue.length} skills`
                    : "Add skill"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

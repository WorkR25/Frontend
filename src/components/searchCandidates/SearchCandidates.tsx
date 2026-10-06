"use client";

import { AtSign, Loader2, Search, SearchX, User, UserSearch, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CandidateRow, CandidateRowSkeleton, CandidateType } from "@/components/allCandidates/CandidatesLists";
import JobsPagination from "@/components/exploreJobs/JobsPagination";
import FormModal from "@/components/ui/FormModal";
import { setShowSearchCandidates } from "@/features/showSearchCandidates/showSearchCandidates";
import { setShowSearchCandidatesByEmail } from "@/features/showSearchCandidates/showSearchCandidatesByEmail";
import { setShowSearchCandidatesByName } from "@/features/showSearchCandidates/showSearchCandidatesByName";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { cn } from "@/utils/cn";
import { useDebounce } from "@/utils/useDebounce";
import useSearchCandidatesByEmail from "@/utils/useSearchCandidatesByEmail";
import useSearchCandidatesByName from "@/utils/useSearchCandidatesByName";

export type SearchMode = "name" | "email";

const PAGE_SIZE = 20;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// One column layout for mixed Student / Working results.
const SEARCH_GRID = "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(0,1fr)_96px]";

function candidateType(user: GetUserResponseType): CandidateType {
  return user.profile?.details === "Working Professional" ? "Working Professional" : "Student";
}

/**
 * One search for candidates: by name (partial, paginated) or by exact email.
 * Typing an "@" switches to email automatically.
 */
export default function SearchCandidates({ initialMode = "name" }: { initialMode?: SearchMode }) {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const inputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const trimmed = query.trim();
  const debounced = useDebounce(trimmed, 300);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  useEffect(() => setPage(1), [debounced, mode]);

  const nameQuery = mode === "name" && debounced.length >= 2 ? debounced : "";
  const emailQuery = mode === "email" && EMAIL_RE.test(debounced) ? debounced : "";

  const byName = useSearchCandidatesByName(jwtToken, nameQuery, page, PAGE_SIZE);
  const byEmail = useSearchCandidatesByEmail(jwtToken, emailQuery);

  const close = useCallback(() => {
    dispatch(setShowSearchCandidatesByName(false));
    dispatch(setShowSearchCandidatesByEmail(false));
    dispatch(setShowSearchCandidates(false));
  }, [dispatch]);

  const onChange = (value: string) => {
    setQuery(value);
    if (value.includes("@") && mode !== "email") setMode("email");
  };

  const switchMode = (next: SearchMode) => {
    setMode(next);
    if (next === "name" && query.includes("@")) setQuery(query.split("@")[0]);
  };

  // ---- Results ------------------------------------------------------------
  const active = mode === "name" ? byName : byEmail;
  const waiting = trimmed !== debounced || active.isFetching;

  const results: GetUserResponseType[] = useMemo(() => {
    if (mode === "name") return nameQuery ? byName.data?.rows ?? [] : [];
    return emailQuery && byEmail.data ? [byEmail.data] : [];
  }, [mode, nameQuery, emailQuery, byName.data, byEmail.data]);

  const total = mode === "name" ? byName.data?.count ?? 0 : results.length;
  const totalPages = mode === "name" ? Math.ceil(total / PAGE_SIZE) : 0;
  const hasSearched = mode === "name" ? !!nameQuery : !!emailQuery;

  let hint: string | null = null;
  if (!trimmed) hint = null;
  else if (mode === "name" && trimmed.length < 2) hint = "Type at least 2 letters.";
  else if (mode === "email" && !EMAIL_RE.test(trimmed)) hint = "Type the full email address, e.g. name@gmail.com.";

  const resultsLabel =
    mode === "name"
      ? `${total.toLocaleString("en-IN")} candidate${total === 1 ? "" : "s"} matching “${nameQuery}”`
      : results.length
        ? "1 candidate with this email"
        : "";

  return (
    <FormModal
      title="Search candidates"
      subtitle="Find anyone who has signed up, by name or by email."
      icon={<UserSearch className="h-[22px] w-[22px]" aria-hidden="true" />}
      iconTone="bg-[#F1EDFF] text-[#5B3CC4]"
      onClose={close}
      widthClassName="sm:max-w-[1240px] sm:h-[92vh]"
      footer={
        totalPages > 1 ? (
          <JobsPagination page={page} totalPages={totalPages} onChange={setPage} />
        ) : (
          <div className="text-[13px] text-[#5B6478]">
            Tip: type an “@” to search by email.
          </div>
        )
      }
    >
      {/* Search bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Search by"
          className="flex gap-1 rounded-2xl border border-[#E4E8F0] bg-white p-1"
        >
          {(["name", "email"] as SearchMode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => switchMode(m)}
              className={cn(
                "flex h-11 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm transition-colors",
                mode === m ? "bg-[#142463] font-bold text-white" : "font-semibold text-[#344054] hover:bg-[#F4F6FA]",
              )}
            >
              {m === "name" ? <User className="h-4 w-4" aria-hidden="true" /> : <AtSign className="h-4 w-4" aria-hidden="true" />}
              {m === "name" ? "Name" : "Email"}
            </button>
          ))}
        </div>

        <div className="flex h-[54px] min-w-0 flex-[999_1_360px] items-center gap-3 rounded-2xl border-[1.5px] border-[#E4E8F0] bg-white pl-4 pr-2 focus-within:border-[#2451D6] focus-within:ring-4 focus-within:ring-[#2451D6]/10">
          {waiting && trimmed ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-[#8A93A6]" aria-hidden="true" />
          ) : (
            <Search className="h-5 w-5 shrink-0 text-[#8A93A6]" aria-hidden="true" />
          )}
          <label htmlFor="candidate-search" className="sr-only">
            {mode === "name" ? "Search candidates by name" : "Search candidates by email"}
          </label>
          <input
            ref={inputRef}
            id="candidate-search"
            type={mode === "email" ? "email" : "text"}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => onChange(e.target.value)}
            placeholder={mode === "name" ? "Type a name, e.g. Akhila" : "Type a full email, e.g. akhila@gmail.com"}
            className="h-full min-w-0 flex-1 bg-transparent text-base font-medium text-[#0F172A] outline-none placeholder:text-[#8A93A6]"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F1F4F9] text-[#344054] hover:bg-[#E4E8F0]"
            >
              <X className="h-4 w-4" strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>

      {hint && <p className="-mt-2 mb-4 text-sm text-[#5B6478]">{hint}</p>}

      {/* Results */}
      {!hasSearched ? (
        !hint && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#C9D2E3] bg-white px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EDFF] text-[#5B3CC4]">
              <UserSearch className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="text-lg font-bold text-[#0F172A]">Search for a candidate</p>
            <p className="max-w-[420px] text-sm text-[#5B6478]">
              Type part of a name to see everyone who matches, or a full email address to find one person.
            </p>
          </div>
        )
      ) : active.isError ? (
        <div className="rounded-2xl border border-[#E4E8F0] bg-white px-6 py-12 text-center">
          <p className="text-base font-bold">Search failed. Please try again.</p>
        </div>
      ) : active.isPending ? (
        <div className="flex flex-col gap-2.5" aria-busy="true">
          {Array.from({ length: mode === "email" ? 1 : 5 }).map((_, i) => (
            <CandidateRowSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#C9D2E3] bg-white px-6 py-14 text-center">
          <SearchX className="h-7 w-7 text-[#8A93A6]" aria-hidden="true" />
          <p className="text-base font-bold text-[#0F172A]">
            {mode === "name" ? `No one named “${nameQuery}”` : "No candidate with this email"}
          </p>
          <p className="text-sm text-[#5B6478]">
            {mode === "name" ? "Check the spelling, or try their email instead." : "Check the address, or try searching by name."}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-sm font-semibold text-[#0F172A]" aria-live="polite">
            {resultsLabel}
          </div>
          <div className={cn("flex flex-col gap-2.5 transition-opacity", waiting && "opacity-60")}>
            {results.map((user) => (
              <CandidateRow key={user.id} user={user} type={candidateType(user)} showType gridClassName={SEARCH_GRID} />
            ))}
          </div>
        </>
      )}
    </FormModal>
  );
}

"use client";

import { Loader2, Search, X } from "lucide-react";
import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import CompanyLogo from "@/components/CompanyLogo";
import { HiringCompany } from "@/types/GetJobType";
import { cn } from "@/utils/cn";

type ExploreHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
  /** Search now with the typed text (Search button / Enter with nothing highlighted). */
  onSubmit: () => void;
  onClear: () => void;
  onPickCompany: (company: HiringCompany) => void;
  suggestions: HiringCompany[];
  /** True while the list belongs to older text and a fresh lookup is on its way. */
  suggestionsStale?: boolean;
  /** False once the typed text is an already-picked company. */
  suggestionsEnabled: boolean;
  trending: HiringCompany[];
};

const FLOAT_DELAYS = ["0s", "-2s", "-4s", "-4s", "0s", "-2s"];

export default function ExploreHero({
  query,
  onQueryChange,
  onSubmit,
  onClear,
  onPickCompany,
  suggestions,
  suggestionsStale = false,
  suggestionsEnabled,
  trending,
}: ExploreHeroProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const showSuggestions =
    open && suggestionsEnabled && query.trim().length > 0 && suggestions.length > 0;

  useEffect(() => {
    setActiveIndex(-1);
  }, [query, suggestions.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pick = (company: HiringCompany) => {
    onPickCompany(company);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" && showSuggestions) {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
      return;
    }
    if (event.key === "ArrowUp" && showSuggestions) {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (showSuggestions && activeIndex >= 0) {
        pick(suggestions[activeIndex]);
      } else {
        onSubmit();
        setOpen(false);
      }
    }
  };

  return (
    <section className="relative z-10 flex flex-wrap items-center gap-8 rounded-3xl bg-[#142463] bg-[radial-gradient(rgba(255,255,255,0.09)_1.2px,transparent_1.2px)] bg-[size:22px_22px] p-6 text-white sm:p-10">
      <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-5">
        <span className="flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-[#DCE4FF]">
          <span className="h-2 w-2 rounded-full bg-[#5BE49B]" />
          New roles added every day
        </span>

        <div className="flex flex-col gap-2.5">
          <h1 className="text-[28px] font-extrabold leading-[1.12] tracking-[-0.035em] sm:text-[40px]">
            Find your next role at a{" "}
            <span className="text-[#8FB0FF]">top product company</span>
          </h1>
          <p className="max-w-[560px] text-base text-[#C9D3F0]">
            Search by company name to see every job they have open on WorkR.
          </p>
        </div>

        <div ref={wrapperRef} className="relative">
          <label htmlFor="company-search" className="sr-only">
            Search jobs by company
          </label>
          <div className="flex h-[60px] items-center gap-3 rounded-2xl bg-white pl-5 pr-2 text-[#5B6478] shadow-[0_16px_40px_rgba(0,0,0,0.22)] focus-within:shadow-[0_0_0_4px_rgba(124,156,255,0.45)]">
            <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              id="company-search"
              type="text"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={
                showSuggestions && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
              }
              autoComplete="off"
              placeholder="Search a company — Cisco, NetApp, Netskope…"
              value={query}
              onChange={(e) => {
                onQueryChange(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              className="h-full min-w-0 flex-1 bg-transparent text-base font-medium text-[#0F172A] outline-none placeholder:text-[#8A93A6]"
            />
            {query.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onClear();
                  inputRef.current?.focus();
                }}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F1F4F9] text-[#344054] hover:bg-[#E4E8F0]"
              >
                <X className="h-[15px] w-[15px]" strokeWidth={2.4} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onSubmit();
                setOpen(false);
              }}
              className="h-11 shrink-0 cursor-pointer rounded-xl bg-[#2451D6] px-4 text-[15px] font-bold text-white transition-colors hover:bg-[#1A3FAF] sm:px-[22px]"
            >
              Search
            </button>
          </div>

          {showSuggestions && (
            <div
              id={listboxId}
              role="listbox"
              aria-label="Matching companies"
              className="absolute inset-x-0 top-[68px] z-30 rounded-2xl border border-[#E4E8F0] bg-white p-2 text-[#0F172A] shadow-[0_24px_48px_rgba(16,32,80,0.22)]"
            >
              <div className="flex items-center justify-between px-2.5 pb-2 pt-1.5 text-xs font-bold tracking-[0.08em] text-[#5B6478]">
                COMPANIES
                {suggestionsStale && (
                  <span className="flex items-center gap-1.5 font-semibold normal-case tracking-normal text-[#8A93A6]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    Searching…
                  </span>
                )}
              </div>
              {suggestions.map((company, index) => (
                <button
                  key={company.id}
                  id={`${listboxId}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(company)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-[10px] p-2.5 text-left transition-opacity",
                    index === activeIndex ? "bg-[#F2F5FC]" : "bg-transparent",
                    suggestionsStale && "opacity-50",
                  )}
                >
                  <CompanyLogo
                    name={company.name}
                    logo={company.logo}
                    className="h-9 w-9 rounded-[10px] border border-[#EEF1F6]"
                    textClassName="text-xs"
                    imagePadding="p-1"
                  />
                  <span className="flex-1 truncate text-[15px] font-semibold">{company.name}</span>
                  <span className="shrink-0 rounded-full bg-[#EAF0FD] px-2.5 py-1 text-xs font-bold text-[#1A3FAF]">
                    {company.jobCount} open {company.jobCount === 1 ? "role" : "roles"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {trending.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[13px] font-semibold text-[#C9D3F0]">Trending:</span>
            {trending.slice(0, 4).map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => pick(company)}
                className="flex h-[34px] cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] py-0 pl-1 pr-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2A3C85]"
              >
                <CompanyLogo
                  name={company.name}
                  logo={company.logo}
                  className="h-[26px] w-[26px] rounded-full"
                  textClassName="text-[10px]"
                  imagePadding="p-[3px]"
                />
                {company.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {trending.length > 0 && (
        <div
          aria-hidden="true"
          className="ml-auto hidden max-w-[320px] flex-[1_1_260px] grid-cols-3 gap-3.5 lg:grid"
        >
          {trending.slice(0, 6).map((company, index) => (
            <div
              key={company.id}
              className={cn("animate-bob", index % 3 === 1 && "mt-7")}
              style={{ animationDelay: FLOAT_DELAYS[index] }}
            >
              <CompanyLogo
                name={company.name}
                logo={company.logo}
                className="aspect-square w-full rounded-[20px] shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
                textClassName="text-xl"
                imagePadding="p-3.5"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

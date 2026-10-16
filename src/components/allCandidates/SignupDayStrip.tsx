"use client";

import { CalendarDays, ChevronLeft, ChevronRight, History, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import { SignupDayType } from "@/utils/useSignupsByDay";

const IST = "Asia/Kolkata";

/** Today's date in India as YYYY-MM-DD. */
export const istTodayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: IST }).format(new Date());

const asDate = (key: string) => new Date(`${key}T12:00:00+05:30`);
const fmt = (key: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: IST, ...options }).format(asDate(key));

/** "Fri, 16 Oct 2026" */
export const formatDayLong = (key: string) =>
  `${fmt(key, { weekday: "short" })}, ${fmt(key, { day: "numeric", month: "short", year: "numeric" })}`;

/** "Today", "Yesterday", otherwise "Wed, 14 Oct" (index 0 is today in the server's list). */
export const dayName = (key: string, today: string) => {
  const diff = Math.round((asDate(today).getTime() - asDate(key).getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return fmt(key, { weekday: "short", day: "numeric", month: "short" });
};

export const ALL_TIME = "all" as const;
export type DaySelection = string | typeof ALL_TIME;

type Props = {
  days: SignupDayType[] | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  selected: DaySelection;
  onSelect: (value: DaySelection) => void;
  today: string;
  canLoadOlder: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
};

/** A scrolling row of day cards: weekday, date, how many people signed up, and a bar for comparing days. */
export default function SignupDayStrip({
  days,
  loading,
  error,
  onRetry,
  selected,
  onSelect,
  today,
  canLoadOlder,
  loadingOlder,
  onLoadOlder,
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const max = Math.max(1, ...(days ?? []).map((d) => d.total));

  // Keep the chosen day in view (e.g. after jumping to a date or loading older days).
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
    el?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [selected]);

  const scrollBy = (dir: -1 | 1) =>
    scroller.current?.scrollBy({ left: dir * Math.max(240, scroller.current.clientWidth * 0.7), behavior: "smooth" });

  return (
    <div className="mb-5">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-bold tracking-[0.08em] text-[#5B6478]">SIGN-UPS BY DAY</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(ALL_TIME)}
            aria-pressed={selected === ALL_TIME}
            className={cn(
              "flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] px-3 text-[13px] font-bold transition-colors",
              selected === ALL_TIME
                ? "border-[#142463] bg-[#142463] text-white"
                : "border-[#E4E8F0] bg-white text-[#344054] hover:border-[#C5D3F2]",
            )}
          >
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            All time
          </button>
          <label className="relative flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] border-[#E4E8F0] bg-white px-3 text-[13px] font-bold text-[#344054] transition-colors focus-within:border-[#2451D6] hover:border-[#C5D3F2]">
            <CalendarDays className="h-3.5 w-3.5 text-[#5B6478]" aria-hidden="true" />
            <span>Jump to date</span>
            <input
              type="date"
              max={today}
              value={selected === ALL_TIME ? "" : selected}
              onChange={(e) => e.target.value && onSelect(e.target.value)}
              aria-label="Jump to a date"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
          <div className="hidden gap-1 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll to newer days"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-[#E4E8F0] bg-white text-[#344054] hover:border-[#C5D3F2]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll to older days"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-[1.5px] border-[#E4E8F0] bg-white text-[#344054] hover:border-[#C5D3F2]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {error && !days ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#F2C6C2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B42318]">
          <span>Couldn’t load the daily sign-up counts.</span>
          <button
            type="button"
            onClick={onRetry}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 text-[13px] font-bold hover:bg-[#FFF5F5]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Retry
          </button>
        </div>
      ) : (
        <div
          ref={scroller}
          className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]"
          role="group"
          aria-label="Sign-ups by day"
        >
          {loading || !days
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-[104px] min-w-[104px] animate-pulse rounded-2xl border border-[#E4E8F0] bg-white" />
              ))
            : days.map((day) => {
                const active = day.date === selected;
                const isToday = day.date === today;
                return (
                  <button
                    key={day.date}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelect(day.date)}
                    title={`${formatDayLong(day.date)}: ${day.total} sign-ups (${day.students} students, ${day.workingProfessionals} working professionals)`}
                    className={cn(
                      "flex h-[104px] min-w-[104px] shrink-0 cursor-pointer snap-start flex-col justify-between rounded-2xl border-[1.5px] p-3 text-left transition-colors",
                      active
                        ? "border-[#142463] bg-[#142463] text-white"
                        : "border-[#E4E8F0] bg-white text-[#0F172A] hover:border-[#C5D3F2]",
                    )}
                  >
                    <span>
                      <span className={cn("block text-[11px] font-bold tracking-[0.06em]", active ? "text-white/70" : "text-[#5B6478]")}>
                        {isToday ? "TODAY" : dayName(day.date, today).toUpperCase()}
                      </span>
                      <span className={cn("block text-xs", active ? "text-white/70" : "text-[#8A93A6]")}>
                        {fmt(day.date, { day: "numeric", month: "short" })}
                      </span>
                    </span>
                    <span>
                      <span className={cn("block text-[26px] font-extrabold leading-none tracking-[-0.02em]", !active && day.total === 0 && "text-[#A3ACBD]")}>
                        {day.total.toLocaleString("en-IN")}
                      </span>
                      <span className={cn("mt-1.5 block h-1.5 overflow-hidden rounded-full", active ? "bg-white/20" : "bg-[#EEF1F6]")}>
                        <span
                          className={cn("block h-full rounded-full", active ? "bg-white" : "bg-[#2451D6]")}
                          style={{ width: `${Math.max(day.total ? 6 : 0, (day.total / max) * 100)}%` }}
                        />
                      </span>
                    </span>
                  </button>
                );
              })}
          {days && canLoadOlder && (
            <button
              type="button"
              onClick={onLoadOlder}
              disabled={loadingOlder}
              className="flex h-[104px] min-w-[104px] shrink-0 cursor-pointer snap-start flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] border-dashed border-[#B9CBF3] bg-white px-3 text-center text-[13px] font-bold text-[#2451D6] hover:border-[#2451D6] disabled:cursor-wait disabled:opacity-70"
            >
              <History className="h-4 w-4" aria-hidden="true" />
              {loadingOlder ? "Loading…" : "Older days"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

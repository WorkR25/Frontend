"use client";

import { UseQueryResult } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2, Plus } from "lucide-react";
import { KeyboardEvent, ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { useDebounce } from "@/utils/useDebounce";

type NamedOption = { id: number; name: string };

export type LocationLookupHook = (
  jwtToken: string | null,
  name: string | undefined,
) => UseQueryResult<unknown>;

export type LocationMatch = "empty" | "checking" | "existing" | "new";

type LocationComboboxProps = {
  id: string;
  step: number;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  /** Reports whether the typed value already exists, is new, or is still being checked. */
  onMatchChange?: (match: LocationMatch) => void;
  useLookup: LocationLookupHook;
  jwtToken: string;
  disabled?: boolean;
  disabledPlaceholder?: string;
  error?: string;
};

/**
 * Searchable field that suggests existing locations and also accepts a new name
 * ("Add “X” as a new city"). Lookups are debounced.
 */
export default function LocationCombobox({
  id,
  step,
  label,
  icon,
  value,
  onChange,
  onMatchChange,
  useLookup,
  jwtToken,
  disabled = false,
  disabledPlaceholder,
  error,
}: LocationComboboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const noun = label.toLowerCase();

  const trimmed = value.trim();
  const debounced = useDebounce(trimmed, 250);
  const { data, isFetching } = useLookup(jwtToken, disabled ? undefined : debounced || undefined);

  const options = useMemo<NamedOption[]>(() => {
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    return (data as NamedOption[])
      .filter((o) => o && typeof o.name === "string")
      .filter((o) => {
        const key = o.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);
  }, [data]);

  const settled = debounced === trimmed && !isFetching;
  const exists = settled && options.some((o) => o.name.toLowerCase() === trimmed.toLowerCase());
  const match: LocationMatch = !trimmed
    ? "empty"
    : !settled
      ? "checking"
      : exists
        ? "existing"
        : "new";

  useEffect(() => {
    onMatchChange?.(match);
  }, [match, onMatchChange]);

  const canCreate = match === "new";
  const items = [
    ...options.map((o) => ({ key: `o-${o.id}`, label: o.name, value: o.name, create: false })),
    ...(canCreate ? [{ key: "create", label: trimmed, value: trimmed, create: true }] : []),
  ];
  const showList = open && !disabled && !!trimmed && (items.length > 0 || match === "checking");

  useEffect(() => setActiveIndex(-1), [trimmed, items.length]);

  useEffect(() => {
    const handle = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape" && showList) {
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === "ArrowDown" && items.length) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (event.key === "ArrowUp" && items.length) {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (event.key === "Enter" && showList && activeIndex >= 0) {
      event.preventDefault();
      choose(items[activeIndex].value);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className={cn("text-sm font-bold", disabled ? "text-[#8A93A6]" : "text-[#0F172A]")}
        >
          <span className="mr-1.5 font-semibold text-[#5B6478]">{step}.</span>
          {label}
        </label>
        {match === "existing" && (
          <span className="flex items-center gap-1 rounded-full bg-[#E3F6EC] px-2.5 py-[3px] text-xs font-bold text-[#11643C]">
            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            Already exists
          </span>
        )}
        {match === "new" && (
          <span className="flex items-center gap-1 rounded-full bg-[#FFF1DB] px-2.5 py-[3px] text-xs font-bold text-[#8A4B00]">
            <Plus className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            New — will be created
          </span>
        )}
        {match === "checking" && (
          <span className="flex items-center gap-1 text-xs font-semibold text-[#5B6478]">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            Checking…
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex h-[52px] items-center gap-3 rounded-[14px] border-[1.5px] px-3.5 transition-shadow",
          disabled ? "border-[#E4E8F0] bg-[#F7F8FB]" : "bg-white",
          !disabled && (error ? "border-[#D92D20]" : "border-[#E4E8F0]"),
          !disabled &&
            "focus-within:border-[#2451D6] focus-within:shadow-[0_0_0_4px_rgba(36,81,214,0.12)]",
        )}
      >
        <span className={cn("flex", disabled ? "text-[#A3ACBD]" : "text-[#2451D6]")}>{icon}</span>
        <input
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={!!error}
          aria-activedescendant={showList && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          disabled={disabled}
          placeholder={disabled ? disabledPlaceholder : `Search or type a ${noun}`}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-[#0F172A] outline-none placeholder:font-medium placeholder:text-[#8A93A6] disabled:cursor-not-allowed"
        />
        <ChevronDown className="h-4 w-4 shrink-0 text-[#5B6478]" strokeWidth={2.2} aria-hidden="true" />
      </div>

      {error ? (
        <p className="text-xs font-medium text-[#D92D20]">{error}</p>
      ) : (
        match === "new" &&
        !open && (
          <p className="text-xs text-[#5B6478]">
            No {noun} called “{trimmed}” yet. It’ll be created when you save.
          </p>
        )
      )}

      {showList && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="absolute inset-x-0 top-[88px] z-20 rounded-[14px] border border-[#E4E8F0] bg-white p-1.5 shadow-[0_18px_40px_rgba(16,32,80,0.18)]"
        >
          {items.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#5B6478]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching…
            </div>
          )}
          {items.map((item, index) => (
            <button
              key={item.key}
              id={`${listboxId}-${index}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(item.value)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-sm",
                item.create ? "mt-1 border-t border-[#EEF1F6] font-bold text-[#2451D6]" : "font-semibold text-[#0F172A]",
                index === activeIndex ? "bg-[#F2F5FC]" : "bg-transparent",
              )}
            >
              {item.create && (
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] bg-[#EAF0FD]">
                  <Plus className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
              )}
              {item.create ? `Add “${item.label}” as a new ${noun}` : item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

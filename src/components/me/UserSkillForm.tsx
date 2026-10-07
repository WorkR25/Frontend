"use client";

import { Loader2, Plus, Search, Sparkles, X } from "lucide-react";
import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { cn } from "@/utils/cn";
import { useDebounce } from "@/utils/useDebounce";
import useCreateUserSkill from "@/utils/useCreateUserSkill";
import useDeleteUserSkill from "@/utils/useDeleteUserSkill";
import useGetSkill from "@/utils/useGetSkill";
import { ProfileCard } from "./profileUi";

/** Skills card: current skills as removable chips plus a search box to add more. */
export default function UserSkillForm({
  user,
  jwtToken,
}: {
  user: GetUserResponseType;
  jwtToken: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const term = useDebounce(query.trim(), 300);
  const { data: results, isFetching } = useGetSkill(jwtToken, term || null);
  const { mutate: addSkill, isPending: adding } = useCreateUserSkill();
  const { mutate: removeSkill } = useDeleteUserSkill();

  const skills = useMemo(() => user.skills ?? [], [user.skills]);
  const options = useMemo(() => {
    const owned = new Set(skills.map((s) => s.id));
    return (results ?? []).filter((r) => !owned.has(r.id)).slice(0, 8);
  }, [results, skills]);

  useEffect(() => setActive(0), [term]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const choose = (opt: { id: number; name: string }) => {
    addSkill({ authJwtToken: jwtToken, skillIds: [opt.id], skillName: opt.name });
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(options.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && options[active]) choose(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length > 0;
  const searching = isFetching || term !== query.trim();

  return (
    <ProfileCard
      id="skills"
      icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
      title="Skills"
      description="Add the tools and technologies you're good at."
      action={
        <span className="rounded-full bg-[#F1F4F9] px-2.5 py-1 text-xs font-bold text-[#5B6478]">
          {skills.length} added
        </span>
      }
    >
      <div ref={rootRef} className="relative">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#2451D6]"
            aria-hidden="true"
          />
          <input
            type="text"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label="Search skills to add"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search skills, e.g. React, SQL, Figma"
            className="h-[52px] w-full rounded-[14px] border-[1.5px] border-[#E4E8F0] bg-white pl-11 pr-11 text-[15px] font-medium text-[#0F172A] outline-none transition placeholder:font-normal placeholder:text-[#98A2B3] focus:border-[#2451D6] focus:ring-4 focus:ring-[#2451D6]/10"
          />
          {(adding || (showList && searching)) && (
            <Loader2
              className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#8A93A6]"
              aria-hidden="true"
            />
          )}
        </div>

        {showList && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-72 overflow-y-auto rounded-2xl border border-[#E4E8F0] bg-white p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
          >
            {options.length > 0 ? (
              options.map((opt, i) => (
                <li
                  key={opt.id}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(opt)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0F172A]",
                    i === active && "bg-[#F4F7FF]",
                  )}
                >
                  {opt.name}
                  <Plus className="h-4 w-4 text-[#2451D6]" aria-hidden="true" />
                </li>
              ))
            ) : (
              <li className="px-3 py-3 text-sm text-[#5B6478]">
                {searching ? "Searching…" : `No new skills match “${query.trim()}”.`}
              </li>
            )}
          </ul>
        )}
      </div>

      {skills.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex items-center gap-1 rounded-full bg-[#EAF0FD] py-1.5 pl-3.5 pr-1.5 text-sm font-semibold text-[#1A3FAF]"
            >
              {skill.name}
              <button
                type="button"
                aria-label={`Remove ${skill.name}`}
                disabled={removingId === skill.id}
                onClick={() => {
                  setRemovingId(skill.id);
                  removeSkill(
                    { authJwtToken: jwtToken, skillId: skill.id },
                    { onSettled: () => setRemovingId(null) },
                  );
                }}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#1A3FAF] hover:bg-[#D5E1FB] disabled:cursor-wait"
              >
                {removingId === skill.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-2xl border-[1.5px] border-dashed border-[#D5DBE6] bg-[#FAFBFD] px-4 py-6 text-center text-sm text-[#5B6478]">
          No skills yet. Search above to add your first one.
        </div>
      )}
    </ProfileCard>
  );
}

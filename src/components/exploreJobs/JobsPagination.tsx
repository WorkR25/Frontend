"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

/** Page numbers to show, with "…" gaps: 1 … 4 5 6 … 95 */
function getPageItems(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push("gap");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);
  return items;
}

export default function JobsPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const items = getPageItems(page, totalPages);

  const navButton =
    "flex h-10 cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#E4E8F0] bg-white px-3.5 text-sm font-semibold transition-colors hover:bg-[#EEF2FA] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E8F0] bg-white px-4 py-3.5"
    >
      <button
        type="button"
        className={cn(navButton, "text-[#5B6478]")}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </button>

      <div className="flex items-center gap-1 text-sm font-semibold">
        {items.map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className="w-8 text-center text-[#5B6478]">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? "page" : undefined}
              aria-label={`Page ${item}`}
              onClick={() => onChange(item)}
              className={cn(
                "h-10 w-10 cursor-pointer rounded-[10px] transition-colors",
                item === page ? "bg-[#142463] text-white" : "text-[#344054] hover:bg-[#EEF2FA]",
              )}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className={cn(navButton, "text-[#0F172A]")}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

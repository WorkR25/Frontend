"use client";

import { CompanyCardProps } from "@/types/CompanyCardProps";
import { ExternalLink } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import MarkdownHTML from "./MarkdownRender";
import { useEffect, useMemo, useRef, useState } from "react";

export default function CompanyCard({
  logoUrl,
  name,
  location,
  industry,
  size,
  description,
  website,
}: CompanyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const cleanDescription = useMemo(
    () => (description ?? "").trim(),
    [description]
  );

  const collapsedHeight = 110;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateHeight = () => {
      setContentHeight(el.scrollHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(el);

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [cleanDescription]);

  const shouldShowToggle = contentHeight > collapsedHeight + 4;

  return (
    <section className="overflow-hidden rounded-3xl border border-[#E4E8F0] bg-white">
      <div className="flex items-center gap-3.5 border-b border-[#DFE7FA] bg-[#EEF3FF] bg-[radial-gradient(#CBD7F5_1.2px,transparent_1.2px)] bg-[size:20px_20px] px-6 py-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_6px_16px_rgba(16,32,80,0.10)]">
          <CompanyLogo
            name={name}
            logo={logoUrl}
            className="h-[42px] w-[42px] rounded-xl"
            textClassName="text-[15px]"
            imagePadding="p-0.5"
          />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-bold tracking-[0.08em] text-[#5B6478]">ABOUT THE COMPANY</div>
          <div className="truncate text-[19px] font-extrabold text-[#0F172A]">{name}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 pb-6 pt-5">
        <dl className="flex flex-col gap-3 text-sm">
          {[
            ["Industry", industry],
            ["Company size", size],
            ["Location", location],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <dt className="font-medium text-[#5B6478]">{label}</dt>
              <dd className="text-right font-bold text-[#0F172A]">{value}</dd>
            </div>
          ))}
        </dl>

        {cleanDescription && (
          <div className="border-t border-dashed border-[#E1E6EF] pt-4">
            <div className="relative">
              <div
                className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
                style={{
                  maxHeight: expanded ? `${contentHeight}px` : `${collapsedHeight}px`,
                }}
              >
                <div
                  ref={contentRef}
                  className="text-sm leading-relaxed text-[#344054] [&_p]:mb-3 [&_p]:!text-sm [&_p]:!leading-[1.65] [&_p:last-child]:mb-0"
                >
                  <MarkdownHTML content={cleanDescription} />
                </div>
              </div>

              {!expanded && shouldShowToggle && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-white" />
              )}
            </div>

            {shouldShowToggle && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 inline-flex cursor-pointer items-center text-sm font-bold text-[#2451D6] hover:text-[#1A3FAF]"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[46px] items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#B9CBF3] text-sm font-bold text-[#2451D6] no-underline transition-colors hover:border-[#2451D6] hover:bg-[#F6F9FF]"
          >
            Visit website
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  );
}

"use client";

import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  Search,
  SearchX,
  Users,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import JobsPagination from "@/components/exploreJobs/JobsPagination";
import FormModal from "@/components/ui/FormModal";
import { setShowAllCandidates } from "@/features/showAllCandidates/showAllCandidatesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { NurtureLeadStatus, NurtureLeadType, NurtureMatch } from "@/types/NurtureLeadsType";
import { DeliveryStatus, NurtureChannel } from "@/types/NurtureStatusType";
import { cn } from "@/utils/cn";
import { getCompanyMonogram, getCompanyTint } from "@/utils/companyBrand";
import { timeAgo } from "@/utils/getTime";
import { useDebounce } from "@/utils/useDebounce";
import { useDownloadNurtureLeadsCsv, useNurtureLeads, useNurtureSummary } from "@/utils/useNurtureLeads";
import CandidatesViewSwitch, { CandidatesView } from "./CandidatesViewSwitch";
import { CandidateRowSkeleton, ContactLine } from "./CandidatesLists";

const PAGE_SIZE = 20;
const DEFAULT_DAY = 2;

const MATCHES: { value: NurtureMatch; label: (day: number) => string; hint: (day: number) => string }[] = [
  {
    value: "reached",
    label: (day) => `Received Day ${day}`,
    hint: (day) => `Everyone whose Day ${day} message has been sent, including people who have moved on to later days.`,
  },
  {
    value: "exact",
    label: (day) => `Currently at Day ${day}`,
    hint: (day) => `People whose latest message is Day ${day}. Their next message has not gone out yet.`,
  },
  {
    value: "next",
    label: (day) => `Due for Day ${day}`,
    hint: (day) => `Active people still waiting for their Day ${day} message, soonest first.`,
  },
];

const STATUS_OPTIONS: { value: "" | NurtureLeadStatus; label: string }[] = [
  { value: "", label: "Active + completed" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed all steps" },
];

const DELIVERY_OPTIONS: { value: "" | DeliveryStatus; label: string }[] = [
  { value: "", label: "Any result" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "processing", label: "Sending" },
  { value: "queued", label: "Queued" },
];

const STATUS_STYLE: Record<NurtureLeadStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-[#EAF0FD] text-[#1A3FAF]" },
  completed: { label: "Completed", className: "bg-[#E3F6EC] text-[#11643C]" },
};

const DELIVERY_STYLE: Record<DeliveryStatus, { label: string; className: string }> = {
  sent: { label: "Sent", className: "bg-[#E3F6EC] text-[#11643C]" },
  failed: { label: "Failed", className: "bg-[#FDECEC] text-[#B42318]" },
  processing: { label: "Sending", className: "bg-[#FFF1DB] text-[#8A4B00]" },
  queued: { label: "Queued", className: "bg-[#FFF1DB] text-[#8A4B00]" },
};

const channelName = (channel: NurtureChannel) => (channel === "WHATSAPP" ? "WhatsApp" : "Email");
const ChannelIcon = ({ channel, className }: { channel: NurtureChannel; className?: string }) =>
  channel === "WHATSAPP" ? <MessageCircle className={className} aria-hidden="true" /> : <Mail className={className} aria-hidden="true" />;

const formatWhen = (iso: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `${new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date)} IST`;
};

const GRID = "md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)_minmax(0,1.15fr)_minmax(0,1.25fr)_minmax(0,1.3fr)]";

function LeadRow({ lead, match }: { lead: NurtureLeadType; match: NurtureMatch }) {
  const name = lead.fullName?.trim() || "Unnamed";
  const tint = getCompanyTint(name);
  const status = STATUS_STYLE[lead.status];
  const experience = lead.yearsOfExperience;
  const detail = [
    lead.currentCtc && `CTC ${/^\d+(\.\d+)?$/.test(lead.currentCtc.trim()) ? `${lead.currentCtc.trim()} LPA` : lead.currentCtc}`,
    experience != null && `${experience} yr${experience === 1 ? "" : "s"} exp`,
  ]
    .filter(Boolean)
    .join(" · ");
  const dueAt = formatWhen(lead.nextDueAt);
  const lastAt = formatWhen(lead.lastSentAt);

  return (
    <article
      className={cn(
        "grid grid-cols-1 items-start gap-3 rounded-2xl border border-[#E4E8F0] bg-white p-4 transition-colors hover:border-[#C5D3F2] md:gap-4 md:px-5",
        GRID,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold"
          style={{ background: tint.bg, color: tint.fg }}
          aria-hidden="true"
        >
          {getCompanyMonogram(name)}
        </span>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-[#0F172A]">{name}</div>
          <div className="text-xs text-[#5B6478]">
            {lead.signedUpAt ? `Signed up ${timeAgo(lead.signedUpAt)}` : `ID #${lead.userId}`}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <ContactLine icon={<Mail className="h-3.5 w-3.5" />} value={lead.email} href={`mailto:${lead.email}`} label="Email" />
        <ContactLine icon={<Phone className="h-3.5 w-3.5" />} value={lead.phoneNo} href={`tel:${lead.phoneNo}`} label="Phone" />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 truncate text-sm font-semibold text-[#0F172A]">
          <Briefcase className="h-3.5 w-3.5 shrink-0 text-[#8A93A6]" aria-hidden="true" />
          <span className="truncate">{lead.currentCompany || "Company not added"}</span>
        </div>
        <div className="mt-0.5 text-xs text-[#5B6478]">{detail || "CTC and experience not added"}</div>
        {lead.domain && (
          <span className="mt-1.5 inline-block max-w-full truncate rounded-full bg-[#EAF0FD] px-2.5 py-0.5 text-xs font-bold text-[#1A3FAF]">
            {lead.domain}
          </span>
        )}
      </div>

      <div className="min-w-0 text-xs text-[#5B6478]">
        <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-bold", status.className)}>{status.label}</span>
        <div className="mt-1.5">
          {lead.lastSentStep != null ? (
            <>
              Last sent <strong className="text-[#0F172A]">{lead.lastSentStep === 0 ? "signup message" : `Day ${lead.lastSentStep}`}</strong>
              {lead.lastSentAt && <span title={lastAt ?? undefined}> · {timeAgo(lead.lastSentAt)}</span>}
            </>
          ) : (
            "Nothing sent yet"
          )}
        </div>
        {lead.status === "active" && lead.nextStep != null && (
          <div className="mt-0.5">
            Next <strong className="text-[#0F172A]">Day {lead.nextStep}</strong>
            {dueAt && <span> · {dueAt}</span>}
          </div>
        )}
      </div>

      <div className="min-w-0">
        {match === "next" ? (
          <div className="flex items-start gap-1.5 text-sm text-[#344054]">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#8A93A6]" aria-hidden="true" />
            <div>
              <div className="font-semibold text-[#0F172A]">{dueAt ?? "Date not set"}</div>
              <div className="text-xs text-[#5B6478]">{lead.channels.map(channelName).join(" + ")}</div>
            </div>
          </div>
        ) : lead.deliveries.length > 0 ? (
          <ul className="flex flex-col gap-1.5">
            {lead.deliveries.map((result) => {
              const style = DELIVERY_STYLE[result.status];
              const when = formatWhen(result.at);
              return (
                <li key={result.channel} className="flex flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className={cn("inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-bold", style.className)}>
                      <ChannelIcon channel={result.channel} className="h-3 w-3" />
                      {channelName(result.channel)} · {style.label}
                    </span>
                  </span>
                  {result.status === "failed" && result.failedReason && (
                    <span className="flex items-start gap-1 text-xs text-[#B42318]" title={result.failedReason}>
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="line-clamp-2">{result.failedReason}</span>
                    </span>
                  )}
                  {when && result.status !== "failed" && <span className="text-xs text-[#8A93A6]">{when}</span>}
                </li>
              );
            })}
          </ul>
        ) : (
          <span className="text-sm text-[#A3ACBD]" title="The sending service could not be asked, so the result is unknown">
            Result unavailable
          </span>
        )}
      </div>
    </article>
  );
}

function SelectFilter<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  title,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <select
      aria-label={label}
      title={title}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as T)}
      className={cn(
        "h-10 cursor-pointer rounded-xl border-[1.5px] border-[#E4E8F0] bg-white px-3 text-sm font-semibold text-[#344054] outline-none transition-colors hover:border-[#C5D3F2] focus:border-[#2451D6] disabled:cursor-not-allowed disabled:opacity-50",
        value !== "" && "border-[#B9CBF3] bg-[#F4F8FF] text-[#1A3FAF]",
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function NurtureLeadsModal({
  view,
  onViewChange,
}: {
  view: CandidatesView;
  onViewChange: (view: CandidatesView) => void;
}) {
  const dispatch = useAppDispatch();
  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const close = useCallback(() => dispatch(setShowAllCandidates(false)), [dispatch]);

  const [day, setDay] = useState(DEFAULT_DAY);
  const [match, setMatch] = useState<NurtureMatch>("reached");
  const [status, setStatus] = useState<"" | NurtureLeadStatus>("");
  const [delivery, setDelivery] = useState<"" | DeliveryStatus>("");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 350);
  const [pages, setPages] = useState<Record<string, number>>({});
  const listTopRef = useRef<HTMLDivElement>(null);

  const params = {
    day,
    match,
    status: status || undefined,
    delivery: delivery || undefined,
    search: search || undefined,
  };
  const pageKey = [day, match, status, delivery, search].join("|");
  const page = pages[pageKey] ?? 1;

  const summary = useNurtureSummary(jwtToken, params.status);
  const { data, isPending, isError, error, isFetching, refetch } = useNurtureLeads(jwtToken, params, page, PAGE_SIZE);
  const { mutate: downloadCsv, isPending: downloading } = useDownloadNurtureLeadsCsv(jwtToken, params);

  const records = data?.records ?? [];
  const totalCount = data?.pagination?.totalCount ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 0;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);
  const hasFilters = !!(status || delivery || searchInput);
  const activeMatch = MATCHES.find((m) => m.value === match)!;
  const allDeliveriesMissing = match !== "next" && records.length > 0 && records.every((lead) => lead.deliveries.length === 0);
  const serverMessage = (error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message;

  const goToPage = (p: number) => {
    setPages((prev) => ({ ...prev, [pageKey]: p }));
    listTopRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const clearFilters = () => {
    setStatus("");
    setDelivery("");
    setSearchInput("");
  };

  return (
    <FormModal
      title="All candidates"
      subtitle="Working professionals still in the WorkR nurture sequence, day by day. Stopped sequences are not listed."
      icon={<Users className="h-[22px] w-[22px]" aria-hidden="true" />}
      iconTone="bg-[#F1EDFF] text-[#5B3CC4]"
      onClose={close}
      widthClassName="sm:max-w-[1240px] sm:h-[92vh]"
      footer={
        totalPages > 1 ? (
          <JobsPagination page={page} totalPages={totalPages} onChange={goToPage} />
        ) : (
          <div className="text-[13px] text-[#5B6478]">
            {!data ? "Loading leads…" : totalCount === 0 ? "No leads to show" : `Showing all ${totalCount.toLocaleString("en-IN")} ${totalCount === 1 ? "lead" : "leads"}`}
          </div>
        )
      }
    >
      <div ref={listTopRef} className="scroll-mt-6" />
      <CandidatesViewSwitch view={view} onChange={onViewChange} />

      <div className="mb-2.5 text-xs font-bold tracking-[0.08em] text-[#5B6478]">NURTURE DAY</div>
      {summary.isError && !summary.data ? (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-[#F2C6C2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B42318]">
          <span>Couldn’t load the counts for each day.</span>
          <button
            type="button"
            onClick={() => summary.refetch()}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 text-[13px] font-bold hover:bg-[#FFF5F5]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Retry
          </button>
        </div>
      ) : (
        <div className="mb-5 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]" role="group" aria-label="Nurture day">
          {!summary.data
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-[92px] min-w-[112px] animate-pulse rounded-2xl border border-[#E4E8F0] bg-white" />
              ))
            : summary.data.days.map((entry) => {
                const active = entry.day === day;
                const count = entry[match];
                return (
                  <button
                    key={entry.day}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDay(entry.day)}
                    className={cn(
                      "flex h-[92px] min-w-[112px] shrink-0 cursor-pointer flex-col justify-between rounded-2xl border-[1.5px] p-3 text-left transition-colors",
                      active ? "border-[#142463] bg-[#142463] text-white" : "border-[#E4E8F0] bg-white text-[#0F172A] hover:border-[#C5D3F2]",
                    )}
                  >
                    <span className="flex items-center justify-between">
                      <span className={cn("text-[11px] font-bold tracking-[0.06em]", active ? "text-white/70" : "text-[#5B6478]")}>
                        DAY {entry.day}
                      </span>
                      <span className={cn("flex items-center gap-1 text-[11px] font-semibold", active ? "text-white/70" : "text-[#8A93A6]")}>
                        {entry.channels.map((channel) => (
                          <ChannelIcon key={channel} channel={channel} className="h-3.5 w-3.5" />
                        ))}
                      </span>
                    </span>
                    <span>
                      <span className={cn("block text-[26px] font-extrabold leading-none tracking-[-0.02em]", !active && count === 0 && "text-[#A3ACBD]")}>
                        {count.toLocaleString("en-IN")}
                      </span>
                      <span className={cn("mt-1 block text-xs", active ? "text-white/70" : "text-[#8A93A6]")}>
                        {entry.channels.map(channelName).join(" + ")}
                      </span>
                    </span>
                  </button>
                );
              })}
        </div>
      )}

      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Which people to show" className="flex flex-wrap gap-1 rounded-2xl border border-[#E4E8F0] bg-white p-1">
          {MATCHES.map((option) => {
            const active = option.value === match;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                title={option.hint(day)}
                onClick={() => setMatch(option.value)}
                className={cn(
                  "h-10 cursor-pointer rounded-xl px-4 text-sm transition-colors",
                  active ? "bg-[#142463] font-bold text-white" : "font-semibold text-[#344054] hover:bg-[#F4F6FA]",
                )}
              >
                {option.label(day)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => downloadCsv()}
          disabled={downloading || totalCount === 0}
          title={totalCount === 0 ? "Nothing to download" : "Downloads every match of the current filters, not just this page"}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-[#B9CBF3] bg-white px-4 text-sm font-bold text-[#2451D6] transition-colors hover:border-[#2451D6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
          {downloading ? "Preparing CSV…" : `Download CSV · Day ${day}`}
        </button>
      </div>
      <p className="mb-4 mt-2 text-[13px] text-[#5B6478]">{activeMatch.hint(day)}</p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1 sm:max-w-[360px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A93A6]" aria-hidden="true" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email or phone"
            aria-label="Search leads"
            maxLength={100}
            className="h-10 w-full rounded-xl border-[1.5px] border-[#E4E8F0] bg-white pl-10 pr-9 text-sm outline-none [&::-webkit-search-cancel-button]:hidden transition-colors placeholder:text-[#A3ACBD] hover:border-[#C5D3F2] focus:border-[#2451D6]"
          />
          {searchInput && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchInput("")}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#8A93A6] hover:bg-[#F1F4F9]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>
        <SelectFilter label="Sequence status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        <SelectFilter
          label="Delivery result"
          value={delivery}
          options={DELIVERY_OPTIONS}
          onChange={setDelivery}
          disabled={match === "next"}
          title={match === "next" ? "That message has not been sent yet, so there is no delivery result" : undefined}
        />
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="h-10 cursor-pointer rounded-xl px-3 text-sm font-bold text-[#2451D6] hover:bg-[#EAF0FD]"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto hidden text-[13px] text-[#5B6478] sm:inline">
          {data && totalCount > 0 ? (
            <>
              Showing <strong className="text-[#0F172A]">{from}–{to}</strong> of {totalCount.toLocaleString("en-IN")}
            </>
          ) : null}
        </span>
      </div>

      {allDeliveriesMissing && (
        <div className="mb-3 flex items-start gap-2 rounded-xl bg-[#FFF8E6] px-3.5 py-2.5 text-[13px] text-[#8A4B00]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Delivery results are unavailable right now, so the sent / failed status can’t be shown.
        </div>
      )}

      <div
        className={cn("hidden gap-4 border border-transparent px-5 pb-2 text-xs font-bold tracking-[0.08em] text-[#5B6478] md:grid", GRID)}
      >
        <span>LEAD</span>
        <span>CONTACT</span>
        <span>CURRENT ROLE</span>
        <span>SEQUENCE</span>
        <span>{match === "next" ? `DAY ${day} DUE` : `DAY ${day} MESSAGE`}</span>
      </div>

      {isError && !data ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E8F0] bg-white px-6 py-12 text-center">
          <p className="text-base font-bold">We couldn’t load these leads.</p>
          {serverMessage && <p className="max-w-[520px] text-sm text-[#5B6478]">{serverMessage}</p>}
          <button
            type="button"
            onClick={() => refetch()}
            className="h-10 cursor-pointer rounded-xl bg-[#2451D6] px-4 text-sm font-bold text-white hover:bg-[#1A3FAF]"
          >
            Try again
          </button>
        </div>
      ) : isPending ? (
        <div className="flex flex-col gap-2.5" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <CandidateRowSkeleton key={i} />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#C9D2E3] bg-white px-6 py-14 text-center">
          {hasFilters ? <SearchX className="h-7 w-7 text-[#8A93A6]" aria-hidden="true" /> : <CheckCircle2 className="h-7 w-7 text-[#8A93A6]" aria-hidden="true" />}
          <p className="text-base font-bold text-[#0F172A]">
            {hasFilters
              ? "No leads match these filters"
              : match === "next"
                ? `No one is waiting for Day ${day} right now`
                : match === "exact"
                  ? `No one is currently at Day ${day}`
                  : `No one has received Day ${day} yet`}
          </p>
          <p className="text-sm text-[#5B6478]">
            {hasFilters ? "Try a different search, or clear the filters." : "People appear here as the sequence reaches this day."}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 h-9 cursor-pointer rounded-xl border-[1.5px] border-[#B9CBF3] bg-white px-4 text-[13px] font-bold text-[#2451D6] hover:border-[#2451D6]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className={cn("flex flex-col gap-2.5 transition-opacity", isFetching && "opacity-60")}>
          {records.map((lead) => (
            <LeadRow key={lead.userId} lead={lead} match={match} />
          ))}
        </div>
      )}
    </FormModal>
  );
}

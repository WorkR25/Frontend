"use client";

import { AlertTriangle, MessageCircle } from "lucide-react";
import { DeliveryStatus, NurtureStatusType, NurtureStepState, NurtureStepType } from "@/types/NurtureStatusType";
import { cn } from "@/utils/cn";
import { timeAgo } from "@/utils/getTime";

const STATUS_STYLE = {
  active: { label: "Active", className: "bg-[#EAF0FD] text-[#1A3FAF]" },
  completed: { label: "Completed", className: "bg-[#E3F6EC] text-[#11643C]" },
  stopped: { label: "Stopped", className: "bg-[#FFF1DB] text-[#8A4B00]" },
} as const;

const STEP_STYLE: Record<NurtureStepState, { className: string; label: string }> = {
  sent: { className: "bg-[#E3F6EC] text-[#11643C]", label: "Sent" },
  next: { className: "bg-[#EAF0FD] text-[#1A3FAF] ring-2 ring-[#2451D6]/40", label: "Next" },
  upcoming: { className: "bg-[#F1F4F9] text-[#8A93A6]", label: "Upcoming" },
  skipped: { className: "border border-dashed border-[#C9D0DC] text-[#A3ACBD]", label: "Skipped" },
  stopped: { className: "bg-[#FDECEC] text-[#B42318] line-through", label: "Not sent (sequence stopped)" },
};

// A step that was handed over is coloured by what the sending service reports for it.
const DELIVERY_STYLE: Record<DeliveryStatus, { className: string; label: string }> = {
  sent: { className: "bg-[#E3F6EC] text-[#11643C]", label: "Sent" },
  failed: { className: "bg-[#FDECEC] text-[#B42318] ring-1 ring-[#B42318]/40", label: "Failed" },
  processing: { className: "bg-[#FFF1DB] text-[#8A4B00]", label: "Sending" },
  queued: { className: "bg-[#FFF1DB] text-[#8A4B00]", label: "Queued" },
};

const STOP_REASONS: Record<string, string> = {
  vsl_registered: "Registered on the VSL",
  user_deleted: "Account deleted",
};

const channelName = (channels: NurtureStepType["channels"]) =>
  channels.map((channel) => (channel === "WHATSAPP" ? "WhatsApp" : "Email")).join(" + ");

const channelLabel = (channel: "EMAIL" | "WHATSAPP") => (channel === "WHATSAPP" ? "WhatsApp" : "Email");

const stepName = (step: NurtureStepType) => (step.day === 0 ? "Signup message" : `Day ${step.day}`);

const formatDue = (iso: string | null) => {
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

export default function NurtureStatusCell({ nurture }: { nurture: NurtureStatusType | null | undefined }) {
  if (nurture === undefined) {
    return <span className="text-sm text-[#A3ACBD]">—</span>;
  }
  if (nurture === null) {
    return <span className="text-xs text-[#A3ACBD]">Status unavailable</span>;
  }
  if (!nurture.inSequence || !nurture.status) {
    return (
      <div className="min-w-0">
        <span className="inline-block rounded-full bg-[#F1F4F9] px-2.5 py-1 text-xs font-bold text-[#5B6478]">Not in sequence</span>
        <div className="mt-1 text-xs text-[#8A93A6]">No nurture messages scheduled</div>
      </div>
    );
  }

  const status = STATUS_STYLE[nurture.status];
  const nextStep = nurture.steps.find((step) => step.state === "next");
  const due = formatDue(nurture.nextDueAt);

  let detail: string;
  if (nurture.status === "active") {
    detail = nextStep
      ? `Next: ${stepName(nextStep)} · ${channelName(nextStep.channels)}${due ? ` · ${due}` : ""}`
      : "Waiting for the next step";
  } else if (nurture.status === "completed") {
    detail = `All steps done${nurture.lastSentAt ? ` · last sent ${timeAgo(nurture.lastSentAt)}` : ""}`;
  } else {
    const reason = nurture.stopReason ? (STOP_REASONS[nurture.stopReason] ?? nurture.stopReason) : "Stopped";
    detail = nurture.lastSentStep ? `${reason} · last sent Day ${nurture.lastSentStep}` : `${reason} · nothing sent after signup`;
  }

  const failures = nurture.steps.flatMap((step) =>
    (step.deliveries ?? [])
      .filter((delivery) => delivery.status === "failed")
      .map((delivery) => ({ step, delivery })),
  );
  const someHandedOver = nurture.steps.some((step) => step.state === "sent");
  const deliveryUnknown = nurture.deliveryChecked === false && someHandedOver;

  return (
    <div className="min-w-0">
      <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-bold", status.className)}>{status.label}</span>
      <div className="mt-1 text-xs text-[#5B6478]">{detail}</div>
      <ol className="mt-1.5 flex flex-wrap gap-1" aria-label="Messages in the sequence">
        {nurture.steps.map((step) => {
          const delivery = step.state === "sent" ? step.delivery : null;
          const style = delivery ? DELIVERY_STYLE[delivery] : STEP_STYLE[step.state];
          const perChannel = (step.deliveries ?? [])
            .map((item) => {
              const label = DELIVERY_STYLE[item.status].label;
              const reason = item.status === "failed" && item.failedReason ? ` (${item.failedReason})` : "";
              return `${channelLabel(item.channel)}: ${label}${reason}`;
            })
            .join("; ");
          const text = `${stepName(step)} · ${channelName(step.channels)} · ${perChannel || style.label}`;
          return (
            <li
              key={step.day}
              title={text}
              aria-label={text}
              className={cn(
                "flex h-[22px] min-w-[26px] items-center justify-center gap-0.5 rounded-md px-1 text-[10px] font-extrabold",
                style.className,
              )}
            >
              {step.day === 0 ? "S" : `D${step.day}`}
              {delivery === "failed" && <AlertTriangle className="h-2.5 w-2.5" aria-hidden="true" />}
              {step.channels.length === 1 && step.channels[0] === "WHATSAPP" && (
                <MessageCircle className="h-2.5 w-2.5" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      {failures.map(({ step, delivery }) => (
        <div
          key={`${step.day}-${delivery.channel}`}
          title={delivery.failedReason ?? undefined}
          className="mt-1 break-words text-xs font-semibold text-[#B42318]"
        >
          {stepName(step)} {channelLabel(delivery.channel)} failed
          {delivery.failedReason ? `: ${delivery.failedReason.slice(0, 160)}${delivery.failedReason.length > 160 ? "…" : ""}` : ""}
        </div>
      ))}
      {deliveryUnknown && <div className="mt-1 text-[11px] text-[#A3ACBD]">Delivery results unavailable</div>}
    </div>
  );
}

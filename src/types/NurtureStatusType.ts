// What the admin candidates list shows about one person's WorkR nurture sequence (built by the User-Service).

// sent = handed to the sending service, next = due next, upcoming = still to come,
// skipped = never goes to this person, stopped = not sent because the sequence ended early
export type NurtureStepState = "sent" | "next" | "upcoming" | "skipped" | "stopped";

// What the sending service reports for one channel of a message that was handed to it:
// sent = the provider accepted it, failed = refused / gave up, processing = still being sent, queued = no record yet
export type DeliveryStatus = "sent" | "failed" | "processing" | "queued";

export type NurtureChannel = "EMAIL" | "WHATSAPP";

export type StepDeliveryType = {
  channel: NurtureChannel;
  status: DeliveryStatus;
  failedReason: string | null;
  /** ISO time the provider accepted it or it failed */
  at: string | null;
};

export type NurtureStepType = {
  /** 0 is the signup message, then the nurture days */
  day: number;
  channels: NurtureChannel[];
  state: NurtureStepState;
  /** One entry per channel of a handed-over step; empty when the sending service could not be asked */
  deliveries?: StepDeliveryType[];
  /** Worst result across the channels; null when unknown or not handed over yet */
  delivery?: DeliveryStatus | null;
};

export type NurtureStatusType = {
  /** false when the person has no nurture row (signed up before the nurture existed) */
  inSequence: boolean;
  status: "active" | "completed" | "stopped" | null;
  stopReason: string | null;
  nextStep: number | null;
  nextDueAt: string | null;
  lastSentStep: number | null;
  lastSentAt: string | null;
  /** false when the sending service could not be asked, so delivery results are unknown */
  deliveryChecked?: boolean;
  steps: NurtureStepType[];
};

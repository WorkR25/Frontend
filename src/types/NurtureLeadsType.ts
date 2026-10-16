import { DeliveryStatus, NurtureChannel, StepDeliveryType } from "@/types/NurtureStatusType";

/** How a person is matched to a nurture day (GET /users/nurture-leads?match=) */
export type NurtureMatch = "reached" | "exact" | "next";
/** The API never lists stopped sequences, so a lead is either still active or has completed every step. */
export type NurtureLeadStatus = "active" | "completed";

export type NurtureLeadType = {
  userId: number;
  fullName: string;
  email: string;
  phoneNo: string;
  graduationYear: string | null;
  currentCompany: string | null;
  currentCtc: string | null;
  domain: string | null;
  yearsOfExperience: number | null;
  signedUpAt: string | null;
  status: NurtureLeadStatus;
  lastSentStep: number | null;
  lastSentAt: string | null;
  nextStep: number | null;
  nextDueAt: string | null;
  /** The nurture day this list was asked about, and the channels that day goes out on for this person */
  day: number;
  channels: NurtureChannel[];
  /** What the sending service says about that day's message. Empty when unknown or not sent yet. */
  deliveries: StepDeliveryType[];
  delivery: DeliveryStatus | null;
};

export type NurtureLeadsPage = {
  records: NurtureLeadType[];
  pagination: { totalCount: number; totalPages: number; currentPage: number; limit: number };
};

export type NurtureDaySummaryType = {
  day: number;
  channels: NurtureChannel[];
  reached: number;
  exact: number;
  next: number;
};

export type NurtureSummaryType = {
  totalInNurture: number;
  days: NurtureDaySummaryType[];
};

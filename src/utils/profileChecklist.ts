import { GetUserResponseType } from "@/types/GetUserResponseType";

/** Sections of the /dashboard/me page that checklist items link to. */
export type ProfileSectionId = "personal" | "professional" | "skills";

export type ProfileChecklistItem = {
  label: string;
  done: boolean;
  section: ProfileSectionId;
};

/** Profile items in the order we nudge people to fill them in. */
export function getProfileChecklist(user: GetUserResponseType): ProfileChecklistItem[] {
  const p = user.profile ?? ({} as GetUserResponseType["profile"]);
  const working = p.details === "Working Professional";
  const items: ProfileChecklistItem[] = [
    { label: "Add your resume", done: !!p.resumeUrl, section: "professional" },
    { label: "Add your skills", done: (user.skills?.length ?? 0) > 0, section: "skills" },
    { label: "Add your LinkedIn profile", done: !!p.linkedinUrl, section: "professional" },
    { label: "Choose your domain", done: !!p.domain, section: "professional" },
    { label: "Write a short bio", done: !!p.bio, section: "professional" },
    { label: "Add your graduation year", done: !!user.graduationYear, section: "personal" },
    { label: "Add your phone number", done: !!user.phoneNo, section: "personal" },
  ];
  if (working) {
    items.push(
      { label: "Add your current company", done: !!p.currentCompany, section: "professional" },
      { label: "Add your current CTC", done: p.currentCtc != null, section: "professional" },
      { label: "Add your years of experience", done: !!p.yearsOfExperience, section: "professional" },
    );
  }
  return items;
}

/** Up to two initials from a full name ("Arijit Ganguly" → "AG"). */
export function getInitials(name?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}

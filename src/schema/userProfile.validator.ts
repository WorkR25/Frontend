import z from "zod";

export const UserProfileSchema = z.object({
  bio: z.string().nullable().optional(),
  yearsOfExperience: z.string().min(1, "Experience must be non-negative"),
  isFresher: z.boolean(),
  currentCtc: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Enter a valid CTC amount",
  }).optional(),
  resumeUrl: z.string().optional(),
  // linkedinUrl: z.string().url("Invalid LinkedIn URL").optional()
  linkedinUrl: z.string().optional(),
  currentLocationId: z.number().nullable().optional(),
  currentCompanyId: z.number().nullable().optional(),
  currentLocation: z.string().nullable().optional(),
});
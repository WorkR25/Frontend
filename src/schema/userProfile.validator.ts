// import z from "zod";

// export const UserProfileSchema = z.object({
//   bio: z.string().nullable().optional(),
//   yearsOfExperience: z.string().min(1, "Experience must be non-negative"),
//   details: z.string(),
//   currentCtc: z.string().nullable().optional(),
//   resumeUrl: z.string().optional(),
//   // linkedinUrl: z.string().url("Invalid LinkedIn URL").optional()
//   linkedinUrl: z.string().optional(),
//   currentLocationId: z.number().nullable().optional(),
//   currentCompany: z.string().nullable().optional(),
//   currentLocation: z.string().nullable().optional(),
//   domain: z.string().nullable().optional(),
// });

import { z } from "zod";

export const UserProfileSchema = z
  .object({
    bio: z.string().nullable().optional(),

    yearsOfExperience: z
      .string()
      .min(1, "Experience must be non-negative"),

    details: z.string(),

    currentCtc: z.string().nullable().optional(),

    resumeUrl: z.string().optional(),

    linkedinUrl: z.string().optional(),

    currentLocationId: z.number().nullable().optional(),

    currentCompany: z.string().nullable().optional(),

    currentLocation: z.string().nullable().optional(),

    domain: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.details === "Working Professional") {
      if (!data.currentCtc?.trim()) {
        ctx.addIssue({
          path: ["currentCtc"],
          message: "Current CTC is required for working professionals",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.currentCompany?.trim()) {
        ctx.addIssue({
          path: ["currentCompany"],
          message: "Current company is required for working professionals",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

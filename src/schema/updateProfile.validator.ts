import z from "zod";

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phoneNo: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  isFresher: z.boolean().nullable().optional(),
  company: z.string().nullable().optional(),
  currentCtc: z.string().nullable().optional(),
  yearsOfExperience: z.string().nullable().optional(),
  resumeUrl: z.any().optional(),
  linkedinUrl: z.string().nullable().optional(),
  bio: z.string().optional(),
  skillIds: z.array(z.number()),
});

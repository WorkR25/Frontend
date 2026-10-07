import { z } from "zod";

export const SignUpFormSchema = z
  .object({
    fullName: z
      .string({ message: "Full name is required" })
      .min(4, { message: "Full name must be at least 4 characters" })
      .max(50, { message: "Full name must be less than 50 characters" }),

    email: z.string().email("Invalid email address"),

    phoneNo: z
      .string({ message: "Phone number is required" })
      .regex(/^[6-9]\d{9}$/, {
        message: "Enter a valid 10-digit Indian mobile number",
      }),

    currentCtc: z.string().optional(),
    currentCompany: z.string().optional(),

    details: z
      .string({ message: "Choose Student or Working professional" })
      .trim()
      .min(1, "Choose Student or Working professional"),

    domain: z
      .string({ message: "Choose your domain" })
      .trim()
      .min(1, "Choose your domain"),

    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .max(32, { message: "Password must be less than 32 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }
      ),

    confirmPassword: z.string(),

    graduationYear: z
      .string({ message: "Graduation year is required" })
      .regex(/^(19|20)\d{2}$/, {
        message: "Graduation year must be between 1900 and 2099",
      }),
  })
  .superRefine((data, ctx) => {
    // Password match check
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.details === "Working Professional") {
      if (!data.currentCtc?.trim()) {
        ctx.addIssue({
          path: ["currentCtc"],
          message: "Choose your current CTC range",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.currentCompany?.trim()) {
        ctx.addIssue({
          path: ["currentCompany"],
          message: "Enter your current company",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

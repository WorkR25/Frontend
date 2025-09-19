import z from "zod";

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
        message: "Phone number must be a valid 10-digit Indian mobile number",
      }),
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
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

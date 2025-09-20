import z from "zod";

export const UserDetailSchema = z.object({
  fullName: z
    .string({ message: "Please enter your full name" })
    .min(2, { message: "Full name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phoneNo: z
    .string({ message: "Please enter a valid phone no " })
    .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
  graduationYear: z
    .string({ message: "Graduation year is required" })
    .regex(/^(19|20)\d{2}$/, {
      message: "Graduation year must be between 1900 and 2099",
    }),
});
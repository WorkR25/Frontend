import z from "zod";

// Login only checks that something was entered: the password rules apply at signup,
// and enforcing them here would lock out accounts created before the rules existed.
export const LogInFormSchema = z.object({
  email: z.string({ message: "Enter your email" }).trim().email("Enter a valid email address"),
  password: z.string({ message: "Enter your password" }).min(1, "Enter your password"),
});

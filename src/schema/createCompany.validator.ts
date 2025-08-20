import z from "zod";

export const CreateCompanySchema= z.object({
    name: z.string().min(1, "Company name is required"),
    logo: z.string().min(1, "Logo is required"),
    description: z.string().optional(),
    website: z.string().optional()
})
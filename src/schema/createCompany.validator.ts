import z from "zod";

export const CreateCompanySchema= z.object({
    name: z.string().min(1, "Please Provide a valid company name"),
    logo: z.string().min(1, "Logo is required"),
    description: z.string().optional(),
    website: z.string().optional()
})
import z from "zod";

export const CreateCompanySchema= z.object({
    name: z.string().min(1, "Please Provide a valid company name"),
    logo: z.string().min(1, "Logo is required"),
    description: z.string().min(2, "Please provide a valid description"),
    website: z.string(),
    company_size_id: z.number("Please select a company size").nullable(),
})
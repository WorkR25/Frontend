import z from "zod";

export const UpdateJobSchema = z.object({
    id: z.number({ message: 'ID is required' }),
    title_id: z.number().optional(),
    employment_type_id: z.number().optional(),
    experience_level_id: z.number().optional(),
    salary_min: z.number().optional(),
    salary_max: z.number().optional(),
    recuiter_id: z.number().optional(),
    company_id: z.number().optional(),
    city_id: z.number().optional(),
    is_remote: z.boolean().optional(),
    apply_link: z.string().optional(),
    skillIds: z.array(z.number()).optional()
});
import z from "zod";

export const UpdateJobSchema = z
  .object({
    id: z.number({ message: "ID is required" }),
    title_id: z.number().optional(),
    employment_type_id: z.number().optional(),
    experience_level_id: z.number().optional(),
    salary_min: z.number({ error: "Enter a number" }).min(0).optional(),
    salary_max: z.number({ error: "Enter a number" }).min(0).optional(),
    recuiter_id: z.number().optional(),
    company_id: z.number().optional(),
    location_id: z.number().optional(),
    is_remote: z.boolean().optional(),
    apply_link: z.url({ error: "Apply link must be a valid URL" }).optional(),
    skillIds: z.array(z.number()).optional(),
    description: z.string().optional(),
  })
  .refine((d) => d.salary_min == null || d.salary_max == null || d.salary_max >= d.salary_min, {
    path: ["salary_max"],
    error: "Maximum can’t be lower than minimum",
  });

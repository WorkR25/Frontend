import { z } from "zod";

export const CreateJobFormSchema = z.object({
  title_id: z.number().min(1, { error: "Job title is required" }),

  employment_type_id: z
    .number()
    .min(1, { error: "Employment type is required" }),

  experience_level_id: z
    .number({ error: "Please select an experience level" })
    .min(1, { error: "Please select an experience level" }),
  company_id: z.number({ error: "Please select a company" }).min(1, { error: "Please select a company" }),
  location_id: z.number({ error: "Please select a city" }).min(1, { error: "Please select a city" }),
  is_remote: z.boolean({ error: "" }),
  apply_link: z.url({ error: "Apply link must be a valid URL" }),
  salary_min: z.number({ error: "Please enter min salary" }).min(1, { error: "Please enter min salary" }),
  salary_max: z.number({ error: "Please enter max salary" }).min(1, { error: "Please enter max salary" }),
  skillIds: z
    .array(z.number({ error: "Please select a skill" }), {
      error: "Please select a skill",
    })
    .min(1, { error: "At least one skill must be selected" }),
  recruiter_id: z.number().min(1, { error: "Recruiter ID is required" }),
  description: z
  .string({
    error: "Description is required",
  })
  .min(1, { message: "Description is required" })
  .refine((val) => {
    const cleaned = val
      .replace(/[#>*_`~\-!\[\]\(\)]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return cleaned.length > 0;
  }, { error: "Description is required" }),
}).refine((data) => !data.salary_min || !data.salary_max || data.salary_max >= data.salary_min, {
  path: ["salary_max"],
  error: "Maximum can’t be lower than minimum",
});

export type CreateJobFormData = z.infer<typeof CreateJobFormSchema>;
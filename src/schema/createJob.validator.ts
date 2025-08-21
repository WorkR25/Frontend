import { z } from "zod";

export const CreateJobFormSchema = z.object({
  title_id: z.number().min(1, { message: "Job title is required" }),

  employment_type_id: z
    .number()
    .min(1, { message: "Employment type is required" }),

  experience_level_id: z
    .number()
    .min(1, { message: "Experience level is required" }),
  company_id: z.number().min(1, { message: "Company ID is required" }),
  city_id: z.number().min(1, { message: "City ID is required" }),
  is_remote: z.boolean({ message: "This field is required" }),
  apply_link: z.string().url({ message: "Apply link must be a valid URL" }),
  salary_min: z.number().min(1, { message: "Company ID is required" }),
  salary_max: z.number().min(1, { message: "Company ID is required" }),
  skillIds: z
    .array(z.number({ message: "Skill ID must be a number" }), {
      message: "Skill IDs are required",
    })
    .min(1, { message: "At least one skill must be selected" }),
  recuiter_id: z.number().min(1, { message: "Recruiter ID is required" }),
  description: z.string().optional() ,
});

//   salary_min: z
//     .number({ message: "Minimum salary is required" })
//     .min(0, { message: "Minimum salary cannot be negative" }),

//   salary_max: z
//     .number({ message: "Maximum salary is required" })
//     .min(0, { message: "Maximum salary cannot be negative" }),

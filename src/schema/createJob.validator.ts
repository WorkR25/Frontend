import { z } from "zod";

export const CreateJobFormSchema = z.object({
  title_id: z.number().min(1, { message: "Job title is required" }),

  employment_type_id: z
    .number()
    .min(1, { message: "Employment type is required" }),

  experience_level_id: z
    .number({ message: "Please select an experience level" })
    .min(1, { message: "Please select an experience level" }),
  company_id: z.number({ message: "Please select a company" }).min(1, { message: "Please select a company" }),
  city_id: z.number({ message: "Please select a city" }).min(1, { message: "Please select a city" }),
  is_remote: z.boolean({ message: "" }),
  apply_link: z.string({ message:"Apply link must be a valid URL" }).url({ message: "Apply link must be a valid URL" }),
  salary_min: z.number({ message: "Please enter min salary" }).min(1, { message: "Please enter min salary" }),
  salary_max: z.number({ message: "Please enter max salary" }).min(1, { message: "Please enter max salary" }),
  skillIds: z
    .array(z.number({ message: "Please select a skill" }), {
      message: "Please select a skill",
    })
    .min(1, { message: "At least one skill must be selected" }),
  recuiter_id: z.number().min(1, { message: "Recruiter ID is required" }),
  description: z.string().optional() ,
});

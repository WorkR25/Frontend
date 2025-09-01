import z from "zod";

export const AddLocationFormSchema = z.object({
  city: z.string({ message: "Please enter a city" }).min(1, { message: "Please enter a city" }),
  state: z.string({ message: "Please enter a state" }).min(1, { message: "Please enter a state" }),
  country: z.string({ message: "Please enter a country" }).min(1, { message: "Please enter a country" }),
});
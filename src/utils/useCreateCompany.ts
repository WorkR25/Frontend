import { jobServiceApi } from "@/lib/axios.config";
import { CreateCompanySchema } from "@/schema/createCompany.validator";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

type CreateCompanyFormType = z.infer<typeof CreateCompanySchema>;

function useCreateCompany() {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      createData,
    }: {
      authJwtToken: string;
      createData: CreateCompanyFormType;
    }) => {
      try {
        const response = await jobServiceApi.post(
          "/companies",
          { ...createData },
          {
            headers: {
              Authorization: authJwtToken,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}

export default useCreateCompany;

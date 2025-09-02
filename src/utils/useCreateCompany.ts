import { jobServiceApi } from "@/lib/axios.config";
import { CreateCompanySchema } from "@/schema/createCompany.validator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
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
    onError: (error) =>{
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error occured while creating company");
      } else {
        toast.error("Error occured while creating company ");
      }
    },

    onSuccess: ()=>{
      toast.success("Company created successfully");
    }
  });
}

export default useCreateCompany;

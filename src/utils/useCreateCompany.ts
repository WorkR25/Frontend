import { jobServiceApi } from "@/lib/axios.config";
import { CreateCompanySchema } from "@/schema/createCompany.validator";
import { ApiResponse } from "@/types/ApiResponse";
import { ErrorResponse } from "@/types/ErrorResponse";
import { useMutation } from "@tanstack/react-query";
import  { AxiosError } from "axios";
import { toast } from "sonner";
import z from "zod";

type CreateCompanyFormType = z.infer<typeof CreateCompanySchema>;

function useCreateCompany() {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      createData,
      file,
    }: {
      authJwtToken: string;
      createData: CreateCompanyFormType;
      file: File | null;
    }) => {
      return await createCompany(authJwtToken,createData,file);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
           error.response?.data?.message ||
           error.message ||
           "Something went wrong";
    
      toast.error(message);
        },

    onSuccess: (data) => {
      toast.success(data.message || "Company created successfully");
    },
  });
}

interface Company{
  company_size_id: number;
  description: string;
  id: number;
  industry_id: number;
  logo: string;      
  name: string;
  website: string; 
};

const createCompany=async(authJwtToken: string, createData: CreateCompanyFormType, file: File | null):Promise<ApiResponse<Company>>=>{
   try {
        if (!file)throw new Error("Company logo is required");
        const formData = new FormData();
        formData.append("file", file);
        const fileUploadUrl = await jobServiceApi.post(
          "/companies/upload-logo",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${authJwtToken}`,
            },
          },
        );
        const logoUrl = fileUploadUrl.data.data.fileUrl;

        const response = await jobServiceApi.post(
          "/companies",
          { ...createData, logo: logoUrl},
          {
            headers: {
              Authorization: authJwtToken,
            },
          },
        );
        return response.data;
      } catch (error) {
        throw error;
      }
}

export default useCreateCompany;

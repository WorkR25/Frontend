import { jobServiceApi } from "@/lib/axios.config";
import { ErrorResponse } from "@/types/ErrorResponse";
import { useMutation } from "@tanstack/react-query";
import  { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";

const useCreateJobTitle = () => {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      title,
    }: {
      authJwtToken: string | null;
      title: string;
    }) => {
      return await createJobTitle(authJwtToken, title);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";

      toast.error(message);
    },
    onSuccess: (data) => {
       toast.success(data.message || "Title created successfully");
    },
  });
};

interface JobTitle {
  id: number;
  title: string;
}

const createJobTitle= async (authJwtToken: string | null, title: string):Promise<ApiResponse<JobTitle>>  => {
  try {
    const response = await jobServiceApi.post(
      "/job-title",
      { title },
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
};

export default useCreateJobTitle;

import { jobServiceApi } from "@/lib/axios.config";
import { CreateJobFormSchema } from "@/schema/createJob.validator";
import { ApiResponse } from "@/types/ApiResponse";
import { ErrorResponse } from "@/types/ErrorResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import z from "zod";
import { Job as JobType } from "@/types/GetJobType";

type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      createJobData,
      authJwtToken,
    }: {
      createJobData: CreateJobFormValues;
      authJwtToken: string | null;
    }) => {
      return await createJob( createJobData,authJwtToken)
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Job posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
    },
  });
};

interface Job{
  jobRecord:JobType;
  jobSkills: { id: number; name: string }[];
}

const createJob=async(createJobData: CreateJobFormValues, authJwtToken: string | null):Promise<ApiResponse<Job>>=>{
  const response = await jobServiceApi.post("/jobs", createJobData, {
        headers: {
          Authorization: `${authJwtToken}`,
        },
      });
      return response.data;
}

export default useCreateJob;

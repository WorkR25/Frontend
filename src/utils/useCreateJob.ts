import { setShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { jobServiceApi } from "@/lib/axios.config";
import { CreateJobFormSchema } from "@/schema/createJob.validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import z from "zod";

type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

const useCreateJob = () => {
  
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      createJobData,
      authJwtToken,
    }: {
      createJobData: CreateJobFormValues;
      authJwtToken: string | null;
    }) => {
      try {
        const response = await jobServiceApi.post("/job", createJobData, {
          headers: {
            Authorization: `${authJwtToken}`,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: () => {
      toast.error("Error creating job");
    },
    onSuccess: () => {
      dispatch(setShowJobCreateForm(false));
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
    },
  });
};

export default useCreateJob;

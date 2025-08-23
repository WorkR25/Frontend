import { jobServiceApi } from "@/lib/axios.config";
import { UpdateJobSchema } from "@/schema/updateJob.validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import z from "zod";

type UpdateJobFormValues = z.infer<typeof UpdateJobSchema>;

const useUpdateJobs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      updateJobData,
    }: {
      authJwtToken: string;
      updateJobData: UpdateJobFormValues;
    }) => {
      try {
        const response = await jobServiceApi.put("/job/", updateJobData, {
          headers: { Authorization: authJwtToken },
        });
        return response.data;
      } catch (error) {
        console.error("Update job error:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["jobDetails", variables.updateJobData.id],
      });
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
    },
    onError: () => {
      toast.error("Error updating job");
    },
  });
};

export default useUpdateJobs;

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
        const response = await jobServiceApi.put("/jobs/", updateJobData, {
          headers: { Authorization: authJwtToken },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      toast.success("Job updated successfully!");
      console.log("getJobDetails", variables.updateJobData.id)
      queryClient.invalidateQueries({

        queryKey: ["getJobDetails", `${variables.updateJobData.id}`],
        refetchType: "active",
      });
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
      queryClient.refetchQueries({ queryKey: ["jobList"] });
      queryClient.refetchQueries({ queryKey: ["getJobDetails", `${variables.updateJobData.id}` ] });
    },
    onError: () => {
      toast.error("Error updating job");
    },
  });
};

export default useUpdateJobs;

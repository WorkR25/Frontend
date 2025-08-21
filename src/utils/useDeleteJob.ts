import { jobServiceApi } from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type DeleteJobFormValues = {
  id: number;
};

const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      authJwtToken,
      deleteJobdata,
    }: {
      authJwtToken: string | null;
      deleteJobdata: DeleteJobFormValues;
    }) => {
      try {
        if(!authJwtToken){
            return new Error("No token provided");
        }
        const response = await jobServiceApi.delete("/job", {
          headers: { Authorization: authJwtToken },
          data: deleteJobdata,
        });
        return response.data;
      } catch (error) {
        console.error("Delete job error:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("success deleting job", data);
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["jobDetails", variables.deleteJobdata.id],
      });
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
    },
    onError: (error) => {
      console.log("error deleting job", error);
      toast.error("Failed to delete job");
    },
  });
};

export default useDeleteJob;

import { jobServiceApi } from "@/lib/axios.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

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
        const response = await jobServiceApi.delete("/jobs", {
          headers: { Authorization: authJwtToken },
          data: deleteJobdata,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["jobDetails", variables.deleteJobdata.id],
      });
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error deleting job");
      } else {
        toast.error("Error deleting job");
      }
    },
  });
};

export default useDeleteJob;

import { jobServiceApi } from "@/lib/axios.config";
import { ApiResponse } from "@/types/ApiResponse";
import { ErrorResponse } from "@/types/ErrorResponse";
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
      return await deleteJob( authJwtToken, deleteJobdata);
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "Job deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["jobDetails", variables.deleteJobdata.id],
      });
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

      toast.error(message);
    },
  });
};

const deleteJob=async(authJwtToken: string | null, deleteJobdata: DeleteJobFormValues):Promise<ApiResponse<boolean>>=>{
  try {
        if(!authJwtToken){
            throw new Error("No token provided");
        }
        const response = await jobServiceApi.delete("/jobs", {
          headers: { Authorization: authJwtToken },
          data: deleteJobdata,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
}

export default useDeleteJob;

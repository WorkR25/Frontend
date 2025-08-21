import { setShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { jobServiceApi } from "@/lib/axios.config";
import { RootState } from "@/lib/store.config";
import { CreateJobFormSchema } from "@/schema/createJob.validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";

type CreateJobFormValues = z.infer<typeof CreateJobFormSchema>;

const useCreateJob = () => {
  //   const authJwtToken= localStorage.getItem("AuthJwtToken");
  const authJwtToken = useSelector(
    (state: RootState) => state.authJwtToken.value
  );
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
    onError: (error) => {
      console.log(authJwtToken);
      console.log("Job creation error:", error);
    },
    onSuccess: (data) => {
      console.log(data);
      dispatch(setShowJobCreateForm(false))
      queryClient.invalidateQueries({ queryKey: ["jobList"] });
    },
  });
};

export default useCreateJob;

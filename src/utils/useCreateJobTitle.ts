import { jobServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useCreateJobTitle = () => {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      title,
    }: {
      authJwtToken: string | null;
      title: string;
    }) => {
      return await createJob(authJwtToken, title);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Error creating Job Title"
        );
      } else {
        toast.error("Error creating Job Title");
      }
    },
    onSuccess: () => {
      toast.success("Title created successfully");
    },
  });
};

const createJob = async (authJwtToken: string | null, title: string) => {
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

    return response;
  } catch (error) {
    throw error;
  }
};

export default useCreateJobTitle;
